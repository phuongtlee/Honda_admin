// VehicleDetail.js
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

const VehicleDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { vehicle } = location.state || {}

  const handleBack = () => {
    navigate('/vehicle')
  }

  if (!vehicle) {
    return <div>Không có thông tin xe!</div>
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '80%', maxWidth: '800px' }}>
        <CCardHeader className="text-center fw-bold" style={{ fontSize: 24 }}>
          Thông Tin Chi Tiết Xe
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle>Tên xe:</CCardTitle>
              <CCardText>{vehicle.vehicleName}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle>Thương hiệu:</CCardTitle>
              <CCardText>{vehicle.brand}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle>Biển số xe:</CCardTitle>
              <CCardText>{vehicle.licensePlate}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle>Ngày mua:</CCardTitle>
              <CCardText>{vehicle.purchaseDate}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle>Màu sắc:</CCardTitle>
              <CCardText>{vehicle.color}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle>Mô hình:</CCardTitle>
              <CCardText>{vehicle.model}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle>Số km:</CCardTitle>
              <CCardText>{vehicle.km}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle>VIN:</CCardTitle>
              <CCardText>{vehicle.vin}</CCardText>
            </CCol>
          </CRow>
          <CRow className="text-center mt-3">
            <CCol xs={12}>
              <CButton color="secondary" className="me-2" onClick={handleBack}>
                Quay lại
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default VehicleDetail
