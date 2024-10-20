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

  console.log(banner.id)

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
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '80%', maxWidth: '800px' }}>
        <CCardHeader className="text-center fw-bold" style={{ fontSize: 24 }}>
          Thông Tin Chi Tiết Banner
        </CCardHeader>
        <CCardBody style={{ maxHeight: '60vh' }}>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle>Tiêu đề:</CCardTitle>
              <CCardText
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {banner.title}
              </CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle>Nội dung:</CCardTitle>
              <CCardText
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                }}
              >
                {banner.newsContent}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={12} className="mb-2">
              <CCardTitle>Hình ảnh:</CCardTitle>
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span>Không có hình ảnh</span>
              )}
            </CCol>
          </CRow>
          <CRow className="text-center mt-3">
            <CCol xs={12}>
              <CButton color="secondary" className="me-2" onClick={handleBack}>
                Quay lại
              </CButton>
              <CButton color="primary" className="ms-2" onClick={handleEdit}>
                Cập nhật banner
              </CButton>
              <CButton color="danger" className="ms-2" onClick={handleDelete}>
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
