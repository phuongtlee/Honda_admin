import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CCardText,
  CCardTitle,
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'

const TestDriveScheduleDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { testDriveSchedule } = location.state || {}

  if (!testDriveSchedule) {
    return <div>Không có thông tin lịch lái thử</div>
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa lịch lái thử này?')
    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `https://localhost:7190/api/TestDriveSchedules/deleteTestDrive/${testDriveSchedule.id}`,
        {
          method: 'DELETE',
        },
      )

      if (response.ok) {
        alert('Xóa lịch lái thử thành công!')
        navigate(-1)
      } else {
        const errorText = await response.text()
        throw new Error(`Xóa không thành công: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa lịch lái thử:', error)
      alert('Xóa lịch lái thử không thành công!')
    }
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}
    >
      <CCard
        className="mb-4 shadow-lg"
        style={{ width: '80%', maxWidth: '800px', borderRadius: '15px' }}
      >
        <CCardHeader
          className="text-center fw-bold"
          style={{
            fontSize: '1.5rem',
            backgroundColor: '#4e73df',
            color: '#fff',
            borderRadius: '15px 15px 0 0',
          }}
        >
          Chi tiết lịch lái thử
        </CCardHeader>
        <CCardBody style={{ padding: '30px' }}>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Tên xe:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {testDriveSchedule.productName}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Người dùng:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {testDriveSchedule.userName}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Ngày lái thử:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {new Date(testDriveSchedule.date).toLocaleDateString()}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Trạng thái:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {testDriveSchedule.status}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="text-center mt-4">
            <CCol xs={12}>
              <CButton color="danger" className="me-3 px-4" onClick={handleDelete}>
                Xóa lịch lái thử
              </CButton>
              <CButton color="primary" className="me-3 px-4" onClick={handleBack}>
                Quay lại
              </CButton>
              <CButton
                color="warning"
                className="px-4"
                onClick={() => navigate('/testDriveUpdate', { state: { testDriveSchedule } })}
              >
                Cập nhật
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default TestDriveScheduleDetail
