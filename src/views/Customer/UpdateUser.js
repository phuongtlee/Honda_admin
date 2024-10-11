import React, { useState, useEffect } from 'react'
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
import { useLocation, useNavigate } from 'react-router-dom'

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

      // Kiểm tra xem email có chứa "STAFF" hay không
      if (user.email.includes('STAFF')) {
        // Điều hướng đến màn hình STAFF
        setTimeout(() => {
          navigate('/staff', { state: { successMessage: 'Cập nhật người dùng thành công!' } })
        }, 1000)
      } else {
        // Điều hướng đến màn hình USER
        setTimeout(() => {
          navigate('/user', { state: { successMessage: 'Cập nhật người dùng thành công!' } })
        }, 1000)
      }
    } catch (error) {
      setError(`Lỗi khi cập nhật người dùng: ${error.message}`)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader>
          <span>Cập nhật thông tin người dùng</span>
          <CButton color="secondary" className="float-end" onClick={() => navigate('/user')}>
            Quay lại
          </CButton>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Tên đầy đủ"
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Tên người dùng"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Số điện thoại"
                  name="phone"
                  value={user.phone.replace(/^\+84/, '0')} // Thay mã vùng +84 bằng số 0
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Địa chỉ"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
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
            <CButton type="submit" color="primary" className="mt-3">
              Cập nhật
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserUpdate
