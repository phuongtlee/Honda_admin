import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CAvatar,
  CSpinner,
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import avatar1 from 'src/assets/images/avatars/1.jpg'

const UserDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state?.user || {}

  const handleBack = () => {
    navigate(-1)
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

  const formattedPhone = user.phone.replace(/^\+84/, '0')

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <CCard className="mb-4 shadow" style={{ width: '100%', maxWidth: '600px' }}>
        <CCardHeader
          className="text-center bg-primary fw-bold"
          style={{ fontSize: 24, color: 'white' }}
        >
          Thông tin người dùng
        </CCardHeader>
        <CCardBody>
          <CRow className="align-items-center">
            <CCol xs={12} className="d-flex align-items-center justify-content-center mb-4">
              <CAvatar
                size="lg"
                src={avatar1}
                alt="User Avatar"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '3px solid #007bff',
                }}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={12}>
              <div className="d-flex justify-content-between">
                <strong>Tên đầy đủ:</strong>
                <span>{user.fullname}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={12}>
              <div className="d-flex justify-content-between">
                <strong>Tên người dùng:</strong>
                <span>{user.username}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={12}>
              <div className="d-flex justify-content-between">
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={12}>
              <div className="d-flex justify-content-between">
                <strong>Số điện thoại:</strong>
                <span>{formattedPhone}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={12}>
              <div className="d-flex justify-content-between">
                <strong>Địa chỉ:</strong>
                <span>{user.address}</span>
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={12}>
              <div className="d-flex justify-content-between">
                <strong>Trạng thái:</strong>
                <span className={user.isActive ? 'text-success' : 'text-danger'}>
                  {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </CCol>
          </CRow>
          <CRow className="text-center mt-4">
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
