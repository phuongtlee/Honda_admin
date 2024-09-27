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
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'

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
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader>
          <span>Cập nhật thông tin dịch vụ</span>
          <CButton color="secondary" className="float-end" onClick={() => navigate('/services')}>
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
                  label="Tên dịch vụ"
                  name="nameService"
                  value={service.nameService}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  id="typeService"
                  name="type"
                  value={service.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn loại dịch vụ</option>
                  <option value="Thay phụ kiện">Thay phụ kiện</option>
                  <option value="Thay nhớt">Thay nhớt</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Giá tiền"
                  name="price"
                  type="number"
                  value={service.price}
                  onChange={handleChange}
                  required
                />
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

export default ServiceUpdate
