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

const Vehicle = () => {
  const [userData, setUserData] = useState([])
  const [vehicleData, setVehicleData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  const usersPerPage = 5

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''

  // Fetch users data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://localhost:7190/api/Users/all`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setUserData(data || [])
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchUsers()
  }, [])

  // Fetch vehicle data when currentPage or searchQuery changes
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/Vehicle/all?page=${currentPage}&size=${usersPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setVehicleData(data || [])
        setTotalPages(Math.ceil(data.length / usersPerPage))
      } catch (error) {
        console.error('Error fetching vehicle data:', error)
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchVehicles()
  }, [currentPage, searchQuery])

  const navigate = useNavigate()

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (vehicle) => {
    navigate('/vehicleDetail', { state: { vehicle } })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const getUsernameByUID = (uid) => {
    const user = userData.find((user) => user.uid === uid)
    return user ? user.fullname : 'Unknown User'
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
        <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Danh sách xe</h5>
          <CFormInput
            type="text"
            placeholder="Tìm kiếm xe..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-50"
          />
        </CCardHeader>
        <CCardBody>
          {error ? (
            <div className="text-danger text-center">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell>Tên xe</CTableHeaderCell>
                    <CTableHeaderCell>Tên người dùng</CTableHeaderCell>
                    <CTableHeaderCell>Biển số xe</CTableHeaderCell>
                    <CTableHeaderCell>Thương hiệu</CTableHeaderCell>
                    <CTableHeaderCell>Ngày mua</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {vehicleData.length > 0 ? (
                    vehicleData
                      .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
                      .map((vehicle, index) => (
                        <CTableRow
                          key={vehicle.id}
                          onClick={() => handleRowClick(vehicle)}
                          style={{ cursor: 'pointer' }}
                        >
                          <CTableDataCell>{vehicle.vehicleName}</CTableDataCell>
                          <CTableDataCell>{getUsernameByUID(vehicle.idUser)}</CTableDataCell>
                          <CTableDataCell>{vehicle.licensePlate}</CTableDataCell>
                          <CTableDataCell>{vehicle.brand}</CTableDataCell>
                          <CTableDataCell>
                            {new Date(vehicle.purchaseDate).toLocaleDateString()}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        Không tìm thấy xe nào
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

export default Vehicle
