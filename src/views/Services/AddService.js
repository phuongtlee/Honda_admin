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
  CFormSelect,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AddService = () => {
  const [nameService, setNameService] = useState('')
  const [typeService, setTypeService] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()
  const handleBack = () => {
    navigate('/services')
  }

  const handleAddService = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('https://localhost:7190/api/Service/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idService: '',
          NameService: nameService,
          Type: typeService,
          Price: parseInt(price),
        }),
      })

      const contentType = response.headers.get('Content-Type')
      let responseBody

      if (contentType && contentType.includes('application/json')) {
        responseBody = await response.json()
      } else {
        responseBody = await response.text()
        console.log('Response body as text:', responseBody)
      }

      if (!response.ok) {
        throw new Error(
          responseBody.error?.message || responseBody || `HTTP error! Status: ${response.status}`,
        )
      }

      setSuccessMessage(responseBody.message || 'Dịch vụ được đăng ký thành công')
      setError(null)
      navigate('/services')
    } catch (error) {
      setError(`Lỗi khi đăng ký dịch vụ: ${error.message}`)
      setSuccessMessage(null)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader className="text-center">
          <h5>Thêm Dịch Vụ</h5>
        </CCardHeader>
        <CCardBody>
          {error && <div className="text-danger text-center mb-3">{error}</div>}
          {successMessage && <div className="text-success text-center mb-3">{successMessage}</div>}
          <CForm onSubmit={handleAddService}>
            <CRow className="mb-3">
              <CFormLabel htmlFor="nameService" className="col-sm-3 col-form-label">
                Tên dịch vụ
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="nameService"
                  value={nameService}
                  onChange={(e) => setNameService(e.target.value)}
                  placeholder="Nhập tên dịch vụ"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="typeService" className="col-sm-3 col-form-label">
                Loại dịch vụ
              </CFormLabel>
              <CCol sm="9">
                <CFormSelect
                  id="typeService"
                  value={typeService}
                  onChange={(e) => setTypeService(e.target.value)}
                  required
                >
                  <option value="">Chọn loại dịch vụ</option>
                  <option value="Thay phụ kiện">Thay phụ kiện</option>
                  <option value="Thay nhớt">Thay nhớt</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="price" className="col-sm-3 col-form-label">
                Giá tiền
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => {
                    const inputValue = e.target.value
                    if (!inputValue.startsWith('-')) {
                      setPrice(inputValue)
                    }
                  }}
                  placeholder="Nhập giá tiền"
                  required
                />
              </CCol>
            </CRow>
            <div className="text-center">
              <CButton color="secondary" className="me-2" onClick={handleBack}>
                Quay lại
              </CButton>
              <CButton type="submit" color="primary" className="me-2">
                Thêm Dịch Vụ
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddService
