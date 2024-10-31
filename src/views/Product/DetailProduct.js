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
          Thông Tin Chi Tiết Sản Phẩm
        </CCardHeader>
        <CCardBody style={{ padding: '30px' }}>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Tên sản phẩm:
              </CCardTitle>
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
                {product.nameProduct.length > 30
                  ? `${product.nameProduct.slice(0, 30)}...`
                  : product.nameProduct}
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Thể loại:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>{product.category}</CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Giá:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {product.price.toLocaleString()} VNĐ
              </CCardText>
            </CCol>
            <CCol sm={6}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Ngày thêm:</CCardTitle>
              <CCardText style={{ fontSize: '1rem', color: '#333' }}>
                {new Date(product.addedDate).toLocaleDateString()}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={12}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Mô tả:</CCardTitle>
              <CCardText
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  fontSize: '1rem',
                  color: '#333',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                {product.description}
              </CCardText>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol sm={12}>
              <CCardTitle style={{ fontSize: '1.2rem', fontWeight: '500' }}>Hình ảnh:</CCardTitle>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.nameProduct}
                  style={{
                    width: '100%',
                    maxWidth: '150px',
                    maxHeight: '100px',
                    height: 'auto',
                    objectFit: 'contain',
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
                Cập nhật sản phẩm
              </CButton>
              <CButton color="danger" className="px-4 py-2" onClick={handleDelete}>
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
