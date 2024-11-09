import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CAlert,
} from '@coreui/react'

const UserUpdate = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState({
    id: '',
    username: '',
    fullname: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const userData = location.state?.user || {}
    setUser(userData)
  }, [location.state])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://localhost:7190/api/Users/update/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          phone: user.phone || '',
          address: user.address || '',
        }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setSuccessMessage('Cập nhật người dùng thành công!')

      setTimeout(() => {
        navigate('/user', { state: { successMessage: 'Cập nhật người dùng thành công!' } })
      }, 1000)
    } catch (error) {
      setError(`Lỗi khi cập nhật người dùng: ${error.message}`)
    }
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <CCard
        className="mb-4"
        style={{ width: '100%', maxWidth: '700px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <CCardHeader
          className="text-center bg-primary fw-bold"
          style={{ fontSize: 24, color: '#fff' }}
        >
          Cập Nhật Thông Tin Người Dùng
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            {/* Tên đầy đủ */}
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Tên đầy đủ"
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                />
              </CCol>
            </CRow>

            {/* Tên người dùng */}
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Tên người dùng"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                />
              </CCol>
            </CRow>

            {/* Email */}
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                />
              </CCol>
            </CRow>

            {/* Số điện thoại */}
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Số điện thoại"
                  name="phone"
                  value={user.phone.replace(/^\+84/, '0')} // Thay mã vùng +84 bằng số 0
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                />
              </CCol>
            </CRow>

            {/* Địa chỉ */}
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Địa chỉ"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                />
              </CCol>
            </CRow>

            {/* Trạng thái kích hoạt */}
            <CRow className="mb-3">
              <CCol>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isActive"
                    checked={user.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Trạng thái kích hoạt</label>
                </div>
              </CCol>
            </CRow>

            {/* Nút Cập nhật */}
            <CRow className="text-center mt-4">
              <CCol>
                <CButton
                  type="submit"
                  color="primary"
                  style={{ width: '100%', borderRadius: '0.25rem' }}
                >
                  Cập nhật
                </CButton>
              </CCol>
              <CCol>
                <CButton
                  color="secondary"
                  onClick={() => navigate('/user')}
                  style={{ width: '100%', borderRadius: '0.25rem' }}
                >
                  Quay lại
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserUpdate
