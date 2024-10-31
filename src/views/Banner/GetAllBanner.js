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
  CTooltip,
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

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
          fetchBanners()
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

      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
          <span>Danh sách tất cả banner</span>
          <div className="d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm banner..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-3"
            />
            <CButton
              color="primary"
              onClick={handleAddBanner}
              style={{
                background: '#ff8000',
                fontSize: '0.9rem',
                padding: '6px 18px',
                marginRight: '10px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 123, 255, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              + Thêm mới
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4 shadow-sm" hover responsive>
                <CTableHead className="text-nowrap bg-light">
                  <CTableRow>
                    <CTableHeaderCell className="text-start">Tên Banner</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Mô tả</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Hình ảnh</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Ngày thêm</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Hành động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {bannerData.length > 0 ? (
                    bannerData.map((banner, index) => (
                      <CTableRow
                        key={index}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(banner)} // Make the row clickable
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
                        <CTableDataCell className="text-center">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            width="80"
                            height="auto"
                            className="rounded"
                          />
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{new Date(banner.createdAt).toLocaleDateString()}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CTooltip content="Xóa banner này">
                            <CButton
                              color="danger"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(banner.id)
                              }}
                            >
                              Xóa
                            </CButton>
                          </CTooltip>
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

              <CPagination align="center" aria-label="Page navigation example">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  &laquo;
                </CPaginationItem>
                {[...Array(totalPages).keys()].map((page) => (
                  <CPaginationItem
                    key={page + 1}
                    active={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  &raquo;
                </CPaginationItem>
              </CPagination>
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default GetAllBanner
