import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CCardText,
  CCardTitle,
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'

const UserDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const service = location.state?.service || {}

  const handleBack = () => {
    navigate('/services')
  }

  const handleUpdate = () => {
    navigate('/updateService', { state: { service } })
  }

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        const response = await fetch(
          `https://localhost:7190/api/Service/delete/${service.idService}`,
          {
            method: 'DELETE',
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        navigate('/services', { state: { successMessage: 'Dịch vụ đã được xóa thành công' } })
      } catch (error) {
        console.error('Error deleting service:', error)
        alert(`Lỗi: ${error.message}`)
      }
    }
  }

  if (!service.idService) {
    return <div>Không có thông tin dịch vụ!</div>
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
          Thông Tin Chi Tiết Dịch Vụ
        </CCardHeader>
        <CCardBody style={{ padding: '30px' }}>
          <CRow className="mb-4">
            <CCol sm={12}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Tên dịch vụ:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {service.nameService}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={12}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Loại dịch vụ:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>{service.type}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={12}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Giá tiền:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>{service.price}</CCardText>
            </CCol>
          </CRow>
          <CRow className="text-center mt-4">
            <CCol xs={12}>
              <CButton color="secondary" className="me-3 px-4 py-2" onClick={handleBack}>
                Quay lại
              </CButton>
              <CButton color="primary" className="me-3 px-4 py-2" onClick={handleUpdate}>
                Cập nhật
              </CButton>
              <CButton color="danger" className="px-4 py-2" onClick={handleDelete}>
                Xóa
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserDetail
