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

  const [testDriveSchedule, setTestDriveSchedule] = useState({
    id: '',
    productId: '',
    productName: '',
    date: '',
    status: 'chờ xác nhận',
    uid: '',
    userName: '',
  })

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <CCard
        className="mb-4"
        style={{
          width: '100%',
          maxWidth: '700px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <CCardHeader
          className="text-center fw-bold"
          style={{ fontSize: 24, backgroundColor: '#007bff', color: '#fff' }}
        >
          Cập Nhật Lịch Lái Thử
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
                <CFormInput
                  label="Ngày lái thử"
                  name="date"
                  type="datetime-local"
                  value={testDriveSchedule.date}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormSelect
                  label="Trạng thái"
                  name="status"
                  value={testDriveSchedule.status}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
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

export default UpdateTestDriveSchedule
