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
        setRepairData(data || [])
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchRepairSchedules()
  }, [currentPage, searchQuery, location])

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
                    <CTableHeaderCell className="text-center">Ngày sửa chữa</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Nhân viên</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Hành động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {repairData.length > 0 ? (
                    repairData.map((repairSchedule, index) => (
                      <CTableRow
                        key={index}
                        onClick={() => navigate('/repairDetail', { state: { repairSchedule } })}
                        style={{ cursor: 'pointer' }}
                      >
                        <CTableDataCell className="text-center">{repairSchedule.id}</CTableDataCell>
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
                      <CTableDataCell colSpan="8" className="text-center ">
                        Không có lịch sửa chữa nào
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

export default RepairSchedules
