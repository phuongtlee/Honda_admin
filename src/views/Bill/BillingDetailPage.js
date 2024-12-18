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

const BillingDetailPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { billing } = location.state || {}

  const handleBack = () => {
    navigate(-1)
  }

  if (!billing) {
    return <div>No billing data available.</div>
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', padding: '20px', backgroundColor: '#f5f5f5', margin: '10px' }}
    >
      <CCard
        className="mb-4 shadow-lg"
        style={{ width: '80%', maxWidth: '800px', borderRadius: '15px' }}
      >
        <CCardHeader
          className="text-center fw-bold"
          style={{
            fontSize: '1.5rem',
            backgroundColor: '#4e73df',
            color: '#fff',
            borderRadius: '15px 15px 0 0',
          }}
        >
          Thông Tin Chi Tiết Hóa Đơn
        </CCardHeader>
        <CCardBody style={{ padding: '30px' }}>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Tên Khách Hàng:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {billing.customerName}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCol sm={6}>
                <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                  Tên Nhân viên sửa chữa:
                </CCardTitle>
                <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                  {billing.staffName}
                </CCardText>
              </CCol>
            </CCol>

            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Tên Xe:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>{billing.carName}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Ngày:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {new Date(billing.date).toLocaleDateString()}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Tổng Chi Phí:
              </CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {billing.totalCost.toLocaleString()} VND
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={12}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Dịch Vụ:</CCardTitle>
              {billing.services.map((service) => (
                <div key={service.id} style={{ marginBottom: '10px' }}>
                  <strong>{service.name}</strong>: {service.price.toLocaleString()} VND
                </div>
              ))}
            </CCol>
          </CRow>
          <CRow className="text-center mt-4">
            <CCol xs={12}>
              <CButton color="secondary" className="px-4 py-2" onClick={handleBack}>
                Quay lại
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default BillingDetailPage
