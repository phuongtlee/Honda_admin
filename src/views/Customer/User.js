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
import { cilPeople } from '@coreui/icons'
import avatar1 from 'src/assets/images/avatars/1.jpg'
import { useNavigate, useLocation } from 'react-router-dom'

const User = () => {
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
          `https://localhost:7190/api/Users/all?page=${currentPage}&size=${usersPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setUserData(data || [])
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchUsers()
  }, [currentPage, searchQuery])

  const navigate = useNavigate()

  const handleAddUser = () => {
    navigate('/addUser')
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (user) => {
    navigate('/userDetail', { state: { user } })
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
          <span>Danh sách người dùng</span>
          <div>
            <CFormInput
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <CButton color="primary" onClick={handleAddUser}>
            Thêm người dùng
          </CButton>
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
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tên đầy đủ</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tên người dùng</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Email
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Trạng thái</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {userData.length > 0 ? (
                    userData
                      .filter((user) => !user.email.toUpperCase().startsWith('STAFF')) // Lọc người dùng có email bắt đầu bằng STAFF
                      .map((user, index) => (
                        <CTableRow
                          key={index}
                          onClick={() => handleRowClick(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          <CTableDataCell className="text-center">
                            <CAvatar size="md" src={avatar1} />
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{user.fullname}</div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{user.username}</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <div>{(user.email && user.email.trim()) || 'N/A'}</div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className={user.isActive ? 'text-success' : 'text-danger'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        Không có người dùng nào
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

export default User
