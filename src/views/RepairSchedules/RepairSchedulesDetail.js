import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react'
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
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '100%', maxWidth: '600px' }}>
        <CCardHeader className="text-center">Chi tiết lịch sửa chữa</CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Tên xe:</strong> <span className="ms-2">{repairSchedule.carname}</span>
              </div>
            </CCol>
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Loại xe:</strong> <span className="ms-2">{repairSchedule.cartype}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Ngày sửa chữa:</strong>
                <span className="ms-2">{new Date(repairSchedule.date).toLocaleDateString()}</span>
              </div>
            </CCol>
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Nhân viên:</strong> <span className="ms-2">{repairSchedule.staff}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Trạng thái:</strong>
                <span className="ms-2">
                  {repairSchedule.status === 'pending' ? 'Chưa hoàn thành' : 'Hoàn thành'}
                </span>
              </div>
            </CCol>
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Tên khách hàng:</strong>{' '}
                <span className="ms-2">{repairSchedule.username}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs="6">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Dịch vụ:</strong> <span className="ms-2">{repairSchedule.service}</span>
              </div>
            </CCol>
          </CRow>
          {repairSchedule.imageUrls && (
            <CRow className="mb-3">
              <CCol className="text-start">
                <strong>Hình ảnh:</strong>
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
                      }}
                    />
                  ))}
                </div>
              </CCol>
            </CRow>
          )}
          <div className="text-center">
            <CButton color="danger" onClick={handleDelete}>
              Xóa lịch sửa chữa
            </CButton>
            <CButton color="primary" onClick={handleBack} className="ms-2">
              Quay lại
            </CButton>
            <CButton
              color="warning"
              onClick={() => navigate('/updateRepair', { state: { repairSchedule } })}
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

export default RepairScheduleDetail
