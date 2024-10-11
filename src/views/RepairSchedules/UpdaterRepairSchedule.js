import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CForm,
  CAlert,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'

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
  })

  const [services, setServices] = useState([])
  const [staffList, setStaffList] = useState([])
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch thông tin lịch sửa chữa từ location state
  useEffect(() => {
    const scheduleData = location.state?.repairSchedule || {}
    // Chuyển đổi định dạng ngày từ UTC về định dạng "yyyy-MM-ddThh:mm"
    if (scheduleData.date) {
      const date = new Date(scheduleData.date)
      const formattedDate = date.toISOString().slice(0, 16) // Chỉ lấy phần ngày và giờ
      scheduleData.date = formattedDate
    }
    setRepairSchedule(scheduleData)

    // Gán giá tiền từ dịch vụ đã được chọn
    const selectedService = services.find((service) => service.idService === scheduleData.service)
    if (selectedService) {
      scheduleData.totalPrice = selectedService.price // Cập nhật giá dịch vụ vào totalPrice
    }
  }, [location.state, services])

  // Fetch danh sách dịch vụ
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

  // Fetch danh sách nhân viên
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
    console.log('Dữ liệu gửi đi:', repairSchedule)

    // Chuyển đổi giá trị ngày sang định dạng UTC
    const updatedSchedule = {
      ...repairSchedule,
      date: new Date(repairSchedule.date).toISOString(), // Chuyển đổi sang UTC
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
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader>
          <span>Cập nhật lịch sửa chữa</span>
          <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
            Quay lại
          </CButton>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Ngày sửa chữa"
                  name="date"
                  type="datetime-local" // Thay đổi type thành 'datetime-local'
                  value={repairSchedule.date}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            {/* Xóa phần chọn dịch vụ */}

            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  label="Nhân viên"
                  name="staff"
                  value={repairSchedule.staff}
                  onChange={handleChange}
                  required
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
              <CCol>
                <CFormSelect
                  label="Trạng thái"
                  name="status"
                  value={repairSchedule.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">Chưa hoàn thành</option>
                  <option value="completed">Hoàn thành</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CButton type="submit" color="primary" className="mt-3">
              Cập nhật
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UpdaterRepairSchedule
