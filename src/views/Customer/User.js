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
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'
import avatar1 from 'src/assets/images/avatars/1.jpg' // Adjust the import path as necessary
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
  const user = location.state?.user || {}
  const successMessage = location.state?.successMessage || ''

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/Users/all?page=${currentPage}&size=${usersPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()

        const sortedData = data
          .filter((user) => !user.email.includes('STAFF'))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setUserData(sortedData || [])
        setTotalPages(Math.ceil(sortedData.length / usersPerPage))
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

      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
          <span>Danh sách người dùng</span>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-2"
              style={{ maxWidth: '250px' }}
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
            <div className="text-danger">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4 shadow-sm" hover responsive>
                <CTableHead className="text-nowrap bg-light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Tên đầy đủ</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Tên người dùng</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Trạng thái</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {userData.length > 0 ? (
                    userData
                      .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
                      .map((user, index) => (
                        <CTableRow
                          key={index}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRowClick(user)}
                        >
                          <CTableDataCell className="text-center">
                            <CAvatar size="md" src={avatar1} />
                          </CTableDataCell>
                          <CTableDataCell className="text-start">{user.fullname}</CTableDataCell>
                          <CTableDataCell className="text-start">{user.username}</CTableDataCell>
                          <CTableDataCell className="text-center">{user.email}</CTableDataCell>
                          <CTableDataCell className="text-start">
                            {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
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

export default User
