import React from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CCol, CRow, CAvatar } from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'

import avatar1 from 'src/assets/images/avatars/1.jpg'

const UserDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state?.user || {}

  const handleBack = () => {
    navigate('/user')
  }

  const handleUpdate = () => {
    navigate('/updateUser', { state: { user } })
  }

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await fetch(`https://localhost:7190/api/Users/delete/${user.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        navigate('/user', { state: { successMessage: 'Người dùng đã được xóa thành công.' } })
      } catch (error) {
        console.error('Error deleting user:', error)
        alert(`Lỗi: ${error.message}`)
      }
    }
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader className="text-center fw-bold" style={{ fontSize: 20 }}>
          <span>Thông tin người dùng</span>
        </CCardHeader>
        <CCardBody>
          <CRow className="align-items-center">
            <CCol xs={12} className="d-flex align-items-center justify-content-center">
              <div className="d-flex align-items-center">
                <CAvatar style={{ width: 150, height: 150 }} src={avatar1} alt="User Avatar" />
                <div className="ms-3">
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Tên đầy đủ:</strong> {user.fullname}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Tên người dùng:</strong> {user.username}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Email:</strong> {user.email}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Số điện thoại:</strong> {user.phone}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Địa chỉ:</strong> {user.address}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Trạng thái:</strong> {user.isActive ? 'Active' : 'Inactive'}
                    </CCol>
                  </CRow>
                </div>
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
