import React, { useEffect, useState } from 'react'
import {
  CAvatar,
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

const Services = () => {
  const [userData, setUserData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  const usersPerPage = 5

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/Service/all?page=${currentPage}&size=${usersPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Fetched Data:', data)
        setUserData(data || [])
        setTotalPages(Math.ceil(data.length / usersPerPage))
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchUsers()
  }, [currentPage, searchQuery])

  const navigate = useNavigate()

  const handleAddService = () => {
    navigate('/addService')
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (service) => {
    navigate('/serviceDetail', { state: { service } })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
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
          <span>Danh sách dịch vụ</span>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-2"
              style={{ maxWidth: '250px' }}
            />
            <CButton
              color="primary"
              onClick={handleAddService}
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
              + Thêm dịch vụ
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
                    <CTableHeaderCell className="text-center">Tên dịch vụ</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Loại dịch vụ</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Giá tiền</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {userData.length > 0 ? (
                    userData
                      .filter(
                        (service) =>
                          service.type !== 'Thay phụ kiện' && service.type !== 'Thay nhớt',
                      )
                      .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
                      .map((service, index) => (
                        <CTableRow
                          key={index}
                          onClick={() => handleRowClick(service)}
                          style={{ cursor: 'pointer' }}
                        >
                          <CTableDataCell className="text-center">
                            {service.nameService}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">{service.type}</CTableDataCell>
                          <CTableDataCell className="text-center">{service.price}</CTableDataCell>
                        </CTableRow>
                      ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="3" className="text-center">
                        Không có dịch vụ
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              <div className="text-center mb-4">
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
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Services
