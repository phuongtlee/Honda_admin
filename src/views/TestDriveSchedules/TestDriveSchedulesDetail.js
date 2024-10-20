import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react'
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
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '100%', maxWidth: '600px' }}>
        <CCardHeader className="text-center">Chi tiết lịch lái thử</CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Tên xe:</strong>{' '}
                <span className="ms-2">{testDriveSchedule.productName}</span>
              </div>
            </CCol>
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Người dùng:</strong>{' '}
                <span className="ms-2">{testDriveSchedule.userName}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Ngày lái thử:</strong>
                <span className="ms-2">
                  {new Date(testDriveSchedule.date).toLocaleDateString()}
                </span>
              </div>
            </CCol>
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Trạng thái:</strong>
                <span className="ms-2">{testDriveSchedule.status}</span>
              </div>
            </CCol>
          </CRow>
          <div className="text-center">
            <CButton color="danger" onClick={handleDelete}>
              Xóa lịch lái thử
            </CButton>
            <CButton color="primary" onClick={handleBack} className="ms-2">
              Quay lại
            </CButton>
            <CButton
              color="warning"
              onClick={() => navigate('/testDriveUpdate', { state: { testDriveSchedule } })}
              className="ms-2"
            >
              Cập nhật
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default TestDriveScheduleDetail
