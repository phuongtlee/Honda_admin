import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CForm,
  CFormSelect,
  CAlert,
} from '@coreui/react'

const UpdaterRepairSchedule = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [repairSchedule, setRepairSchedule] = useState({
    id: '',
    carName: '',
    carType: '',
    date: '',
    service: '',
    staff: '',
    totalPrice: '',
    uid: '',
    username: '',
    status: 'pending',
    statusCheck: 'Chưa xác nhận',
  })

  const [services, setServices] = useState([])
  const [staffList, setStaffList] = useState([])
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const scheduleData = location.state?.repairSchedule || {}
    setRepairSchedule(scheduleData)
  }, [location.state])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://localhost:7190/api/Service/all')
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách dịch vụ')
        }
        const data = await response.json()
        setServices(data)
      } catch (error) {
        setError(`Lỗi khi lấy dữ liệu dịch vụ: ${error.message}`)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('https://localhost:7190/api/Users/all')
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách nhân viên')
        }
        const data = await response.json()
        const filteredStaff = data.filter((user) => user.email.startsWith('STAFF'))
        setStaffList(filteredStaff)
      } catch (error) {
        setError(`Lỗi khi lấy dữ liệu nhân viên: ${error.message}`)
      }
    }

    fetchStaff()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setRepairSchedule((prevSchedule) => ({
      ...prevSchedule,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedSchedule = {
      ...repairSchedule,
      date: repairSchedule.date,
    }

    try {
      const response = await fetch(
        `https://localhost:7190/api/RepairSchedules/update/${repairSchedule.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSchedule),
        },
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || 'Không có thông điệp lỗi'}`,
        )
      }
      setSuccessMessage('Cập nhật lịch sửa chữa thành công!')
      setTimeout(() => {
        navigate(-2, {
          state: { successMessage: 'Cập nhật lịch sửa chữa thành công!' },
        })
      }, 1000)
    } catch (error) {
      setError(`Lỗi khi cập nhật lịch sửa chữa: ${error.message}`)
    }
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <CCard
        className="mb-4"
        style={{ width: '100%', maxWidth: '700px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <CCardHeader
          className="text-center fw-bold"
          style={{ fontSize: 24, backgroundColor: '#007bff', color: '#fff' }}
        >
          Cập Nhật Lịch Sửa Chữa
          <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
            Quay lại
          </CButton>
        </CCardHeader>
        <CCardBody style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          {error && <CAlert color="danger">{error}</CAlert>}
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormSelect
                  label="Nhân viên"
                  name="staff"
                  value={repairSchedule.staff}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                >
                  <option value="">Chọn nhân viên</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.fullname}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormSelect
                  label="Trạng thái"
                  name="status"
                  value={repairSchedule.status}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                >
                  <option value="Chưa hoàn thành">Chưa hoàn thành</option>
                  <option value="Đã hoàn thành">Hoàn thành</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormSelect
                  label="Trạng thái xác nhận"
                  name="statusCheck"
                  value={repairSchedule.statusCheck}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                >
                  <option value="Chưa xác nhận">Chưa xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CButton
              type="submit"
              color="primary"
              className="mt-3"
              style={{ borderRadius: '0.25rem' }}
            >
              Cập nhật
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UpdaterRepairSchedule
