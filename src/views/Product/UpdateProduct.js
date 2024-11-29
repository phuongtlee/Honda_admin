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
  CFormTextarea,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilArrowLeft } from '@coreui/icons'

const EditProduct = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { product } = location.state || {}

  const [nameProduct, setNameProduct] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState(null)
  const [fileChanged, setFileChanged] = useState(false)

  useEffect(() => {
    if (product) {
      setNameProduct(product.nameProduct)
      setCategory(product.category)
      setPrice(product.price)
      setDescription(product.description)
      setImageUrl(product.imageUrl || '')
    }
  }, [product])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setError('Chỉ hỗ trợ ảnh (JPG, PNG, GIF).')
        setImageFile(null)
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Kích thước file vượt quá 10MB.')
        setImageFile(null)
      } else {
        setError(null)
        setImageFile(file)
        setFileChanged(true)
      }
    }
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append('id', product.id)
      formData.append('nameProduct', nameProduct)
      formData.append('category', category)
      formData.append('price', price)
      formData.append('description', description)

      if (imageFile) {
        formData.append('image', imageFile)
      } else {
        formData.append('imageUrl', imageUrl)
      }

      const response = await fetch(`https://localhost:7190/api/Product/update/${product.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Cập nhật sản phẩm thất bại')
      }

      const result = await response.json()
      console.log('Cập nhật sản phẩm thành công:', result)

      navigate(-2)
    } catch (error) {
      console.error('Có lỗi xảy ra khi cập nhật sản phẩm:', error)
    }
  }

  const handleBack = () => {
    navigate('/product')
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <CCard
        className="mb-4"
        style={{
          width: '100%',
          maxWidth: '700px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <CCardHeader
          className="text-center fw-bold"
          style={{ fontSize: 24, backgroundColor: '#007bff', color: '#fff' }}
        >
          Cập Nhật Sản Phẩm
        </CCardHeader>
        <CCardBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <CForm>
            {/* Product Name */}
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormInput
                  type="text"
                  id="nameProduct"
                  label="Tên sản phẩm"
                  value={nameProduct}
                  onChange={(e) => setNameProduct(e.target.value)}
                  style={{ borderRadius: '0.25rem' }}
                  placeholder="Nhập tên sản phẩm"
                />
              </CCol>
            </CRow>

            {/* Category */}
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormSelect
                  id="category"
                  label="Thể loại"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ borderRadius: '0.25rem' }}
                >
                  <option value="">Chọn thể loại</option>
                  <option value="Tay ga">Tay ga</option>
                  <option value="Tay côn">Tay côn</option>
                  <option value="Xe máy">Xe máy</option>
                  <option value="Xe moto">Xe moto</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Price */}
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormInput
                  type="number"
                  id="price"
                  label="Giá"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ borderRadius: '0.25rem' }}
                  placeholder="Nhập giá sản phẩm"
                />
              </CCol>
            </CRow>

            {/* Description */}
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormTextarea
                  id="description"
                  label="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ borderRadius: '0.25rem' }}
                  rows="4"
                  placeholder="Nhập mô tả sản phẩm"
                />
              </CCol>
            </CRow>

            {/* Image Upload */}
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormInput
                  type="file"
                  id="imageUrl"
                  label="Chọn hình ảnh"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ borderRadius: '0.25rem' }}
                />
                {error && <div style={{ marginTop: '10px', color: 'red' }}>{error}</div>}
                {!fileChanged && !imageFile && (
                  <div style={{ marginTop: '10px', color: 'red' }}>
                    Hãy chọn lại ảnh để cập nhật
                  </div>
                )}
              </CCol>
            </CRow>

            {imageUrl && !imageFile && (
              <CRow className="mb-3">
                <CCol sm={12}>
                  <img
                    src={imageUrl}
                    alt="Current product"
                    style={{ width: '100%', maxWidth: '200px', objectFit: 'cover' }}
                  />
                </CCol>
              </CRow>
            )}

            <CRow className="text-center mt-3">
              <CCol xs={12}>
                <CButton color="primary" className="me-2" onClick={handleSave}>
                  <CIcon icon={cilSave} /> Lưu thay đổi
                </CButton>
                <CButton color="secondary" onClick={handleBack}>
                  <CIcon icon={cilArrowLeft} /> Quay lại
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default EditProduct
