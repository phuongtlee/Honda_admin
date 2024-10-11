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

const EditProduct = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { product } = location.state || {}

  // State to manage form data
  const [nameProduct, setNameProduct] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState(null)
  const [fileChanged, setFileChanged] = useState(false)

  // Load product details when the component mounts
  useEffect(() => {
    if (product) {
      setNameProduct(product.nameProduct)
      setCategory(product.category)
      setPrice(product.price)
      setDescription(product.description)
      setImageUrl(product.imageUrl || '') // Ensure imageUrl is set from product
    }
  }, [product])

  // Handle file input change
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
      }
    }
  }

  // Handle save product updates
  const handleSave = async () => {
    try {
      const updatedProduct = {
        id: product.id,
        nameProduct,
        category,
        price,
        description,
        imageUrl: imageFile ? imageFile : imageUrl, // Only change imageUrl if a new file is selected
      }

      const formData = new FormData()
      formData.append('id', updatedProduct.id)
      formData.append('nameProduct', updatedProduct.nameProduct)
      formData.append('category', updatedProduct.category)
      formData.append('price', updatedProduct.price)
      formData.append('description', updatedProduct.description)

      // Append image only if a new image file is selected
      if (imageFile) {
        formData.append('image', imageFile)
      } else {
        formData.append('imageUrl', imageUrl) // Send old imageUrl if no new image file is selected
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
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '80%', maxWidth: '800px' }}>
        <CCardHeader className="text-center fw-bold" style={{ fontSize: 24 }}>
          Cập Nhật Sản Phẩm
        </CCardHeader>
        <CCardBody>
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
                  custom
                  accept="image/*"
                />
                {/* Hiển thị tên file đã chọn (nếu có) */}
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

            {/* Error display */}
            {error && (
              <CRow className="mb-3">
                <CCol sm={12}>
                  <div style={{ color: 'red' }}>{error}</div>
                </CCol>
              </CRow>
            )}

            {/* Save and Back Buttons */}
            <CRow className="text-center mt-3">
              <CCol xs={12}>
                <CButton color="primary" className="me-2" onClick={handleSave}>
                  Lưu thay đổi
                </CButton>
                <CButton color="secondary" className="ms-2" onClick={handleBack}>
                  Quay lại
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
