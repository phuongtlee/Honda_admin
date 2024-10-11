import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CPagination,
  CPaginationItem,
  CFormInput,
} from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const GetAllBanner = () => {
  const [bannerData, setBannerData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  const bannersPerPage = 10

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''

  const fetchBanners = async () => {
    try {
      const response = await fetch(
        `https://localhost:7190/api/Banner/all?page=${currentPage}&size=${bannersPerPage}&search=${searchQuery}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setBannerData(data || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching banner data:', error)
      setError(`Error fetching data: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [currentPage, searchQuery])

  const navigate = useNavigate()

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (banner) => {
    navigate('/bannerDetail', { state: { banner } })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleAddBanner = () => {
    navigate('/addBanner')
  }

  const handleDelete = async (bannerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        const response = await fetch(`https://localhost:7190/api/Banner/delete/${bannerId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          alert('Banner đã được xóa thành công.')
          // Refresh the banner list after deletion
          fetchBanners() // Call fetchBanners here to refresh the data
        } else {
          const errorData = await response.json()
          alert(
            `Xóa banner không thành công: ${errorData.message || 'Không có thông báo chi tiết.'}`,
          )
        }
      } catch (error) {
        console.error('Có lỗi khi xóa banner:', error)
        alert('Xóa banner không thành công.')
      }
    }
  }

  return (
    <>
      {showAlert && successMessage && (
        <CAlert
          color="success"
          className="text-center"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          {successMessage}
        </CAlert>
      )}

      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Danh sách tất cả banner</span>
          <div>
            <CButton color="primary" onClick={handleAddBanner}>
              Thêm banner mới
            </CButton>
          </div>
          <div>
            <CFormInput
              type="text"
              placeholder="Tìm kiếm banner..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </CCardHeader>
        <CCardBody>
          {error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Tên Banner
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Mô tả
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Hình ảnh
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Ngày thêm
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Hành động
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {bannerData.length > 0 ? (
                    bannerData.map((banner, index) => (
                      <CTableRow
                        key={index}
                        onClick={() => handleRowClick(banner)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CTableDataCell className="text-start">
                          <div>{banner.title}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>
                            {banner.newsContent.length > 50
                              ? banner.newsContent.substring(0, 50) + '...'
                              : banner.newsContent}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <img src={banner.imageUrl} alt={banner.title} width="100" />
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{new Date(banner.createdAt).toLocaleDateString()}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <CButton
                            color="danger"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(banner.id)
                            }}
                          >
                            Xóa
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        Không có banner
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              <div className="text-center mb-4">
                <CPagination aria-label="Page navigation example" size="sm">
                  {[...Array(totalPages).keys()].map((page) => (
                    <CPaginationItem
                      key={page + 1}
                      active={page + 1 === currentPage}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </CPaginationItem>
                  ))}
                </CPagination>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default GetAllBanner
