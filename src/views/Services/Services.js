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
        setTotalPages(data.totalPages || 1)
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

      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Danh sách dịch vụ</span>
          <div>
            <CFormInput
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <CButton color="primary" onClick={handleAddService}>
            Thêm dịch vụ
          </CButton>
        </CCardHeader>
        <CCardBody>
          {error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow className="text-center">
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Tên dịch vụ
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Loại dịch vụ
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Giá tiền
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {userData.length > 0 ? (
                    userData.map((service, index) => (
                      <CTableRow
                        key={index}
                        onClick={() => handleRowClick(service)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CTableDataCell className="text-center">
                          <div>{service.nameService}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{service.type}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{service.price}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="3" className="text-center">
                        No users found
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

export default Services
