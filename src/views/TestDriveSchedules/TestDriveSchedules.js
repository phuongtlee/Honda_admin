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

const TestDriveSchedules = () => {
  const [testDriveData, setTestDriveData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  const usersPerPage = 5

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTestDriveSchedules = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/TestDriveSchedules/allTestDrives?page=${currentPage}&size=${usersPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTestDriveData(data || [])
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchTestDriveSchedules()
  }, [currentPage, searchQuery, location])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
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
          <span>Danh sách lịch lái thử</span>
          <div>
            <CFormInput
              type="text"
              placeholder="Tìm kiếm xe..."
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
                    {/* <CTableHeaderCell>ID</CTableHeaderCell> */}
                    <CTableHeaderCell>Tên sản phẩm</CTableHeaderCell>
                    <CTableHeaderCell>Người dùng</CTableHeaderCell>
                    <CTableHeaderCell>Ngày lái thử</CTableHeaderCell>
                    <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {testDriveData.length > 0 ? (
                    testDriveData.map((testDriveSchedule, index) => (
                      <CTableRow
                        key={index}
                        onClick={() =>
                          navigate('/testDriveDetail', { state: { testDriveSchedule } })
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        {/* <CTableDataCell>{testDrive.id}</CTableDataCell> */}
                        <CTableDataCell>{testDriveSchedule.productName}</CTableDataCell>
                        <CTableDataCell>{testDriveSchedule.userName}</CTableDataCell>
                        <CTableDataCell>{formatDateTime(testDriveSchedule.date)}</CTableDataCell>
                        <CTableDataCell>{testDriveSchedule.status}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        Không có lịch lái thử nào
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

export default TestDriveSchedules
