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
import CIcon from '@coreui/icons-react'
import { cilCarAlt } from '@coreui/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const RepairSchedules = () => {
  const [repairData, setRepairData] = useState([])
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
    const fetchRepairSchedules = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/RepairSchedules/all?page=${currentPage}&size=${usersPerPage}&search=${searchQuery}`,
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

  // Hàm định dạng ngày giờ
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) // Định dạng ngày giờ cho Việt Nam
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
          <span>Danh sách lịch sửa chữa</span>
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
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilCarAlt} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tên xe</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Người dùng</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Loại xe</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Ngày sửa chữa</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Nhân viên</CTableHeaderCell>
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
                        <CTableDataCell className="text-center">
                          {/* Placeholder for potential car image */}
                        </CTableDataCell>
                        <CTableDataCell>{repairSchedule.carname}</CTableDataCell>
                        <CTableDataCell>{repairSchedule.username}</CTableDataCell>
                        <CTableDataCell>{repairSchedule.cartype}</CTableDataCell>
                        <CTableDataCell>
                          {formatDateTime(repairSchedule.date)} {/* Hiển thị ngày giờ */}
                        </CTableDataCell>
                        <CTableDataCell>{repairSchedule.staff}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
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
