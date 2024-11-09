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

const Staff = () => {
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

  const filteredUsers = userData.filter((user) =>
    user.email ? user.email.toUpperCase().startsWith('STAFF') : false,
  )

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
          <h5>Danh sách người dùng</h5>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-2"
              style={{ width: '250px' }}
            />
            <CButton
              color="primary"
              onClick={handleAddUser}
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
              + Thêm người dùng
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error ? (
            <div className="text-danger text-center">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4" hover responsive>
                <CTableHead className="bg-light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Tên đầy đủ</CTableHeaderCell>
                    <CTableHeaderCell>Tên người dùng</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <CTableRow
                        key={index}
                        onClick={() => handleRowClick(user)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CTableDataCell className="text-center">
                          <CAvatar size="md" src={avatar1} />
                        </CTableDataCell>
                        <CTableDataCell>{user.fullname}</CTableDataCell>
                        <CTableDataCell>{user.username}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {user.email || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className={user.isActive ? 'text-success' : 'text-danger'}>
                            {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        Không có người dùng
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              <CPagination align="center" aria-label="Page navigation">
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Staff
