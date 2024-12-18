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

const RepairSchedules = () => {
  const [repairData, setRepairData] = useState([])
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
    const fetchRepairSchedules = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/RepairSchedules/all?page=${currentPage}&size=${schedulesPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        const sortedData = data.sort((a, b) => {
          if (a.statusCheck === 'Chưa xác nhận' && b.statusCheck !== 'Chưa xác nhận') return -1
          if (a.statusCheck !== 'Chưa xác nhận' && b.statusCheck === 'Chưa xác nhận') return 1
          return 0
        })

        setRepairData(sortedData || [])
        setTotalPages(Math.ceil(sortedData.length / schedulesPerPage))
      } catch (error) {
        console.error('Error fetching repair schedule data:', error)
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchRepairSchedules()
  }, [currentPage, searchQuery])

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
          <span>Danh sách lịch sửa chữa</span>
          <div className="d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm lịch..."
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
                    <CTableHeaderCell className="text-center">Id</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Tên xe</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Người dùng</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Loại xe</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Ngày hẹn </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Nhân viên</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Trạng thái xác nhận</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Trạng thái hoàn thành
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Hành động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {repairData.length > 0 ? (
                    repairData
                      .slice((currentPage - 1) * schedulesPerPage, currentPage * schedulesPerPage)
                      .map((repairSchedule, index) => (
                        <CTableRow
                          key={index}
                          onClick={() => navigate('/repairDetail', { state: { repairSchedule } })}
                          style={{ cursor: 'pointer' }}
                        >
                          <CTableDataCell className="text-center">
                            {repairSchedule.id}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {repairSchedule.carname}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {repairSchedule.username}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {repairSchedule.cartype}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {new Date(repairSchedule.date).toUTCString()}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {repairSchedule.staff}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {repairSchedule.statusCheck}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {repairSchedule.status}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CTooltip content="Chi tiết lịch sửa chữa">
                              <CButton
                                color="info"
                                variant="outline"
                                onClick={() =>
                                  navigate('/repairDetail', { state: { repairSchedule } })
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
                      <CTableDataCell colSpan="9" className="text-center ">
                        Không có lịch sửa chữa nào
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

export default RepairSchedules
