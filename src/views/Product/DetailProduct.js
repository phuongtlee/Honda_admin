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

const ProductDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { product } = location.state || {}

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        // Gọi API xóa sản phẩm từ backend sử dụng fetch
        const response = await fetch(`https://localhost:7190/api/Product/delete/${product.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          alert('Sản phẩm đã được xóa thành công.')
          navigate('/product')
        } else {
          const errorData = await response.json()
          alert(
            `Xóa sản phẩm không thành công: ${errorData.message || 'Không có thông báo chi tiết.'}`,
          )
        }
      } catch (error) {
        console.error('Có lỗi khi xóa sản phẩm:', error)
        alert('Xóa sản phẩm không thành công.')
      }
    }
  }

  const handleBack = () => {
    navigate('/product')
  }

  const handleEdit = () => {
    navigate(`/productUpdate`, { state: { product } })
  }

  if (!product) {
    return <div>Không có thông tin sản phẩm!</div>
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '80%', maxWidth: '800px' }}>
        <CCardHeader className="text-center fw-bold" style={{ fontSize: 24 }}>
          Thông Tin Chi Tiết Sản Phẩm
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle>Tên sản phẩm:</CCardTitle>
              <CCardText>{product.nameProduct}</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle>Thể loại:</CCardTitle>
              <CCardText>{product.category}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6} className="mb-2">
              <CCardTitle>Giá:</CCardTitle>
              <CCardText>{product.price.toLocaleString()} VNĐ</CCardText>
            </CCol>
            <CCol sm={6} className="mb-2">
              <CCardTitle>Ngày thêm:</CCardTitle>
              <CCardText>{new Date(product.addedDate).toLocaleDateString()}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={12} className="mb-2">
              <CCardTitle>Mô tả:</CCardTitle>
              <CCardText style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {product.description}
              </CCardText>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol sm={12} className="mb-2">
              <CCardTitle>Hình ảnh:</CCardTitle>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.nameProduct}
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
                Cập nhật sản phẩm
              </CButton>
              <CButton color="danger" className="ms-2" onClick={handleDelete}>
                Xóa sản phẩm
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ProductDetail
