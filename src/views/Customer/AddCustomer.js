import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CCol,
  CRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AddUser = () => {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()

  const handleAddUser = async (event) => {
    event.preventDefault()

    const formattedPhone = phone ? `+84${phone.replace(/^0/, '')}` : ''

    const user = {
      Username: username,
      Fullname: fullname,
      Email: email,
      Password: password,
      Phone: formattedPhone,
      Address: address,
    }

    try {
      const response = await fetch('https://localhost:7190/api/Users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      const contentType = response.headers.get('Content-Type')
      let responseBody

      if (contentType && contentType.includes('application/json')) {
        responseBody = await response.json()
      } else {
        responseBody = await response.text()
      }

      if (!response.ok) {
        throw new Error(
          responseBody.error?.message || responseBody || `HTTP error! Status: ${response.status}`,
        )
      }

      setSuccessMessage(responseBody.message || 'User registered successfully')
      setError(null)
      navigate('/user')
    } catch (error) {
      setError(`Error registering user: ${error.message}`)
      setSuccessMessage(null)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader className="text-center">
          <h5>Đăng Ký Người Dùng</h5>
        </CCardHeader>
        <CCardBody>
          {error && <div className="text-danger text-center mb-3">{error}</div>}
          {successMessage && <div className="text-success text-center mb-3">{successMessage}</div>}
          <CForm onSubmit={handleAddUser}>
            <CRow className="mb-3">
              <CFormLabel htmlFor="fullname" className="col-sm-3 col-form-label">
                Tên đầy đủ
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Nhập tên đầy đủ"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="username" className="col-sm-3 col-form-label">
                Tên người dùng
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên người dùng"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="email" className="col-sm-3 col-form-label">
                Email
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="phone" className="col-sm-3 col-form-label">
                Số điện thoại
              </CFormLabel>
              <CCol sm="9">
                <div className="input-group">
                  <span className="input-group-text">+84</span>
                  <CFormInput
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    // required
                  />
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="address" className="col-sm-3 col-form-label">
                Địa chỉ
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ người dùng"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="password" className="col-sm-3 col-form-label">
                Mật khẩu
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </CCol>
            </CRow>
            <div className="text-center">
              <CButton type="submit" color="primary">
                Đăng Ký
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddUser
