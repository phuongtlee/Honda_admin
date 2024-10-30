import React from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CCol, CRow, CAvatar } from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'

import avatar1 from 'src/assets/images/avatars/1.jpg'

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
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
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

        navigate('/services', { state: { successMessage: 'Dịch vụ được đăng ký thành công' } })
      } catch (error) {
        console.error('Error deleting user:', error)
        alert(`Lỗi: ${error.message}`)
      }
    }
  }

  console.log(service.idService)
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader className="text-center fw-bold" style={{ fontSize: 20 }}>
          <span>Thông tin dịch vụ</span>
        </CCardHeader>
        <CCardBody>
          <CRow className="align-items-center">
            <CCol xs={12} className="d-flex align-items-center">
              <div className="ms-3">
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <strong>Tên dịch vụ:</strong> {service.nameService}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <strong>Loại dịch vụ:</strong> {service.type}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <strong>Giá tiền:</strong> {service.price}
                  </CCol>
                </CRow>
              </div>
            </CCol>
          </CRow>
          <CRow className="text-center mt-3">
            <CCol xs={12}>
              <CButton color="secondary" className="me-2" onClick={handleBack}>
                Quay lại
              </CButton>
              <CButton color="danger" className="me-2" onClick={handleDelete}>
                Xóa
              </CButton>
              <CButton color="primary" className="me-2" onClick={handleUpdate}>
                Cập nhật
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserDetail
