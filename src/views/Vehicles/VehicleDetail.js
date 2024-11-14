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
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }} // Light background for contrast
    >
      <CCard
        className="mb-4"
        style={{
          width: '90%',
          maxWidth: '800px',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CCardHeader
          className="text-center bg-primary fw-bold"
          style={{ fontSize: '1.5rem', color: 'white' }}
        >
          Thông Tin Chi Tiết Xe
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>Tên xe:</CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>{vehicle.vehicleName}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                Thương hiệu:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>{vehicle.brand}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>Biển số xe:</CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>{vehicle.licensePlate}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>Ngày mua:</CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>
                {new Date(vehicle.purchaseDate).toLocaleDateString()}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>Màu sắc:</CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>{vehicle.color}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>Mô hình:</CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>{vehicle.model}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>Số km:</CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>{vehicle.km} km</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle style={{ fontSize: '1.1rem', fontWeight: '500' }}>VIN:</CCardTitle>
              <CCardText style={{ fontSize: '1rem' }}>{vehicle.vin}</CCardText>
            </CCol>
          </CRow>
          <CRow className="text-center mt-4">
            <CCol xs={12}>
              <CButton
                color="secondary"
                className="me-2"
                onClick={handleBack}
                style={{ borderRadius: '20px', padding: '10px 20px', fontSize: '1rem' }}
              >
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
