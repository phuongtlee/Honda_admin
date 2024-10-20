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

const UpdateTestDriveSchedule = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Dữ liệu mặc định của lịch lái thử
  const [testDriveSchedule, setTestDriveSchedule] = useState({
    id: '',
    productId: '',
    productName: '',
    date: '',
    status: 'chờ xác nhận', // Giá trị mặc định là 'chờ xác nhận'
    uid: '',
    userName: '',
  })

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Lấy dữ liệu từ state nếu có
  useEffect(() => {
    const scheduleData = location.state?.testDriveSchedule || {}
    if (scheduleData.date) {
      const date = new Date(scheduleData.date)
      const formattedDate = date.toISOString().slice(0, 16)
      scheduleData.date = formattedDate
    }
    setTestDriveSchedule(scheduleData)
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTestDriveSchedule((prevSchedule) => ({
      ...prevSchedule,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const updatedSchedule = {
      date: new Date(testDriveSchedule.date).toISOString(),
      status: testDriveSchedule.status,
    }

    try {
      const response = await fetch(
        `https://localhost:7190/api/TestDriveSchedules/updateTestDrive/${testDriveSchedule.id}`,
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
      setSuccessMessage('Cập nhật lịch lái thử thành công!')
      setTimeout(() => {
        navigate(-2, {
          state: { successMessage: 'Cập nhật lịch lái thử thành công!' },
        })
      }, 1000)
    } catch (error) {
      setError(`Lỗi khi cập nhật lịch lái thử: ${error.message}`)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader>
          <span>Cập nhật lịch lái thử</span>
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
                  label="Ngày lái thử"
                  name="date"
                  type="datetime-local"
                  value={testDriveSchedule.date}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  label="Trạng thái"
                  name="status"
                  value={testDriveSchedule.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
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

export default UpdateTestDriveSchedule
