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
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilArrowLeft } from '@coreui/icons'

const ServiceUpdate = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [service, setService] = useState({
    idService: '',
    nameService: '',
    type: '',
    price: '',
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const serviceData = location.state?.service || {}
    setService(serviceData)
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `https://localhost:7190/api/Service/update/${service.idService}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(service),
        },
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setSuccessMessage('Service updated successfully!')
      setTimeout(() => {
        navigate('/services', { state: { successMessage: 'Service updated successfully!' } })
      }, 1000)
    } catch (error) {
      setError(`Error updating service: ${error.message}`)
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
          className="text-center fw-bold"
          style={{ fontSize: 24, backgroundColor: '#007bff', color: '#fff' }}
        >
          Cập nhật thông tin dịch vụ
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormInput
                  label="Tên dịch vụ"
                  name="nameService"
                  value={service.nameService}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                  placeholder="Nhập tên dịch vụ"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormSelect
                  id="typeService"
                  name="type"
                  value={service.type}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                >
                  <option value="">Chọn loại dịch vụ</option>
                  {/* <option value="Thay phụ kiện">Thay phụ kiện</option> */}
                  {/* <option value="Thay nhớt">Thay nhớt</option> */}
                  <option value="Phụ tùng">Phụ tùng</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormInput
                  label="Giá tiền"
                  name="price"
                  type="number"
                  value={service.price}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0.25rem' }}
                  placeholder="Nhập giá tiền"
                />
              </CCol>
            </CRow>
            <CRow className="text-center mt-4">
              <CCol xs={6}>
                <CButton
                  color="primary"
                  type="submit"
                  style={{ width: '100%', borderRadius: '0.25rem' }}
                >
                  <CIcon icon={cilSave} className="me-2" />
                  Cập nhật
                </CButton>
              </CCol>
              <CCol xs={6}>
                <CButton
                  color="secondary"
                  onClick={() => navigate('/services')}
                  style={{ width: '100%', borderRadius: '0.25rem' }}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
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

export default ServiceUpdate
