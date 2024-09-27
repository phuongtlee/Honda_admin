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

  // Fetch users data
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

  // Fetch vehicle data
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
        setTotalPages(data.totalPages || 1)
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

  // Function to get username from UID
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
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Danh sách xe</span>
          <div>
            <CFormInput
              type="text"
              placeholder="Tìm kiếm người dùng..."
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
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Tên xe
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Tên người dùng
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Biển số xe
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Thương hiệu
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Ngày mua
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {vehicleData.length > 0 ? (
                    vehicleData.map((vehicle, index) => (
                      <CTableRow
                        key={index}
                        onClick={() => handleRowClick(vehicle)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CTableDataCell className="text-center">
                          <CAvatar size="md" src={avatar1} />
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{vehicle.vehicleName}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{getUsernameByUID(vehicle.idUser)}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{vehicle.licensePlate}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{vehicle.brand}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{vehicle.purchaseDate}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No vehicles found
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

export default Vehicle
