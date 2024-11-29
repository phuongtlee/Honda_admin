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

const TestDriveSchedules = () => {
  const [testDriveData, setTestDriveData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  const schedulesPerPage = 5

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTestDriveSchedules = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/TestDriveSchedules/allTestDrives?page=${currentPage}&size=${schedulesPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const sortedData = data.sort((a, b) => {
          if (a.status === 'Chờ xác nhận' && b.status !== 'Chờ xác nhận') return -1
          if (a.status !== 'Chờ xác nhận' && b.status === 'Chờ xác nhận') return 1
          return 0
        })
        setTestDriveData(sortedData || [])
        setTotalPages(Math.ceil(sortedData.length / schedulesPerPage))
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

      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
          <span>Danh sách lịch lái thử</span>
          <div className="d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm lịch lái thử..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-3"
            />
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
                    <CTableHeaderCell className="text-center">Tên sản phẩm</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Người dùng</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Ngày lái thử</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Hành động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {testDriveData.length > 0 ? (
                    testDriveData
                      .slice((currentPage - 1) * schedulesPerPage, currentPage * schedulesPerPage)
                      .map((testDriveSchedule, index) => (
                        <CTableRow
                          key={index}
                          onClick={() =>
                            navigate('/testDriveDetail', { state: { testDriveSchedule } })
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <CTableDataCell className="text-center">
                            {testDriveSchedule.productName}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {testDriveSchedule.userName}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {formatDateTime(testDriveSchedule.date)}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {testDriveSchedule.status}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CTooltip content="Chi tiết lịch lái thử">
                              <CButton
                                color="info"
                                variant="outline"
                                onClick={() =>
                                  navigate('/testDriveDetail', { state: { testDriveSchedule } })
                                }
                              >
                                Chi tiết
                              </CButton>
                            </CTooltip>
                          </CTableDataCell>
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

export default TestDriveSchedules
