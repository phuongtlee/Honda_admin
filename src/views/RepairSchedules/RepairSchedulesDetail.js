import React, { useEffect, useState } from 'react'
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

const RepairScheduleDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { repairSchedule } = location.state || {}
  const [repairSchedules, setRepairSchedules] = useState([])

  if (!repairSchedule) {
    return <div>Không có thông tin lịch sửa chữa</div>
  }

  const fetchSchedules = async () => {
    try {
      const response = await fetch('https://localhost:7190/api/RepairSchedules')
      if (!response.ok) throw new Error('Không thể lấy danh sách lịch sửa chữa')
      const data = await response.json()
      setRepairSchedules(data)
    } catch (error) {
      console.error('Đã xảy ra lỗi khi lấy danh sách lịch sửa chữa:', error)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa lịch sửa chữa này?')
    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `https://localhost:7190/api/RepairSchedules/delete/${repairSchedule.id}`,
        {
          method: 'DELETE',
        },
      )

      if (response.ok) {
        alert('Xóa lịch sửa chữa thành công!')
        navigate('/repairSchedules')
      } else {
        const errorText = await response.text()
        throw new Error(`Xóa không thành công: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa lịch sửa chữa:', error)
      alert('Xóa lịch sửa chữa không thành công!')
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
          Chi tiết lịch sửa chữa
        </CCardHeader>
        <CCardBody style={{ padding: '30px' }}>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Tên xe:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {repairSchedule.carname}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Loại xe:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {repairSchedule.cartype}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Ngày sửa chữa:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {new Date(repairSchedule.date).toUTCString()}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Nhân viên:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {repairSchedule.staff}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Trạng thái:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {repairSchedule.status === 'pending' ? 'Chưa hoàn thành' : 'Hoàn thành'}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Tên khách hàng:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {repairSchedule.username}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Dịch vụ:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {repairSchedule.service}
              </CCardText>
            </CCol>
          </CRow>
          {repairSchedule.imageUrls && repairSchedule.imageUrls.length > 0 ? (
            <CRow className="mb-4">
              <CCol sm={12}>
                <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Hình ảnh:</CCardTitle>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    marginTop: '10px',
                  }}
                >
                  {repairSchedule.imageUrls.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Repair Image ${index + 1}`}
                      style={{
                        width: '200px',
                        height: 'auto',
                        margin: '5px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </div>
              </CCol>
            </CRow>
          ) : (
            <CRow className="mb-4">
              <CCol sm={12}>
                <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Hình ảnh:</CCardTitle>
                <CCardText style={{ fontSize: '1rem', color: '#333' }}>Không có hình ảnh</CCardText>
              </CCol>
            </CRow>
          )}

          <CRow className="text-center mt-4">
            <CCol xs={12}>
              <CButton color="danger" className="me-3 px-4" onClick={handleDelete}>
                Xóa lịch sửa chữa
              </CButton>
              <CButton color="primary" className="me-3 px-4" onClick={handleBack}>
                Quay lại
              </CButton>
              <CButton
                color="warning"
                className="px-4"
                onClick={() => navigate('/updateRepair', { state: { repairSchedule } })}
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

export default RepairScheduleDetail
