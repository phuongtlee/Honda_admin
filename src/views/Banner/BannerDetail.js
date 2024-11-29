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

const BannerDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { banner } = location.state || {}

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        const response = await fetch(`https://localhost:7190/api/Banner/delete/${banner.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          alert('Banner đã được xóa thành công.')
          navigate('/banner')
        } else {
          const errorData = await response.json()
          alert(
            `Xóa banner không thành công: ${errorData.message || 'Không có thông báo chi tiết.'}`,
          )
        }
      } catch (error) {
        console.error('Có lỗi khi xóa banner:', error)
        alert('Xóa banner không thành công.')
      }
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(`/bannerUpdate`, { state: { banner } })
  }

  if (!banner) {
    return <div>Không có thông tin banner!</div>
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}
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
          Thông Tin Chi Tiết Banner
        </CCardHeader>
        <CCardBody style={{ padding: '30px' }}>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Tiêu đề:</CCardTitle>
              <CCardText
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  fontSize: '1rem',
                  color: '#333',
                }}
              >
                {banner.title}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Nội dung:</CCardTitle>
              <CCardText
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  fontSize: '1rem',
                  color: '#333',
                }}
              >
                {banner.newsContent}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={12}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Hình ảnh:</CCardTitle>
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  style={{
                    width: '100%',
                    maxWidth: '250px',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                />
              ) : (
                <span style={{ fontSize: '1rem', color: '#666' }}>Không có hình ảnh</span>
              )}
            </CCol>
          </CRow>
          <CRow className="text-center mt-4">
            <CCol xs={12}>
              <CButton color="secondary" className="me-3 px-4 py-2" onClick={handleBack}>
                Quay lại
              </CButton>
              <CButton color="primary" className="me-3 px-4 py-2" onClick={handleEdit}>
                Cập nhật banner
              </CButton>
              <CButton color="danger" className="px-4 py-2" onClick={handleDelete}>
                Xóa banner
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default BannerDetail
