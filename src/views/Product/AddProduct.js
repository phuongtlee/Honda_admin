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
  CFormTextarea,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const [nameProduct, setNameProduct] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null) // Quản lý file ảnh
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleAddProduct = async (event) => {
    event.preventDefault()

    console.log('Form submitted with:', {
      nameProduct,
      price,
      description,
      category,
      image,
    })

    setIsSubmitted(true)
    setError(null)
    setSuccessMessage('')

    if (!nameProduct || !price || !description || !category || !image) {
      setError('Tất cả các trường phải được điền đầy đủ và chọn ảnh.')
      setIsSubmitted(false)
      return
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      setError('Giá sản phẩm phải là một số dương.')
      setIsSubmitted(false)
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('nameProduct', nameProduct)
      formData.append('price', price)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('addedDate', new Date().toISOString())
      formData.append('image', image)

      const response = await fetch('https://localhost:7190/api/Product/add', {
        method: 'POST',
        body: formData,
      })

      const responseBody = await response.json()

      if (!response.ok) {
        throw new Error(responseBody.message || 'Lỗi khi thêm sản phẩm.')
      }

      setSuccessMessage('Sản phẩm đã được thêm thành công!')
      setImage(null)
      setLoading(false)

      navigate('/product')
    } catch (error) {
      setError(`Lỗi khi thêm sản phẩm: ${error.message}`)
      setLoading(false)
    } finally {
      setIsSubmitted(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log('File selected:', file)

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setError('Chỉ hỗ trợ ảnh (JPG, PNG, GIF).')
        setImage(null)
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Kích thước file vượt quá 10MB.')
        setImage(null)
      } else {
        setError(null)
        setImage(file)
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CCard className="mb-4" style={{ width: '50%' }}>
        <CCardHeader className="text-center">
          <h5>Thêm Sản Phẩm</h5>
        </CCardHeader>
        <CCardBody>
          {error && <div className="text-danger text-center mb-3">{error}</div>}
          {successMessage && <div className="text-success text-center mb-3">{successMessage}</div>}

          <CForm>
            {/* Tên sản phẩm */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="nameProduct" className="col-sm-3 col-form-label">
                Tên sản phẩm
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="nameProduct"
                  value={nameProduct}
                  onChange={(e) => setNameProduct(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </CCol>
            </CRow>

            {/* Giá */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="price" className="col-sm-3 col-form-label">
                Giá
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Nhập giá sản phẩm"
                  min="0"
                  step="0.01"
                  required
                />
              </CCol>
            </CRow>

            {/* Mô tả */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="description" className="col-sm-3 col-form-label">
                Mô tả
              </CFormLabel>
              <CCol sm="9">
                <CFormTextarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                  rows="5"
                  style={{ fontFamily: 'Arial', fontSize: '16px' }}
                  required
                />
              </CCol>
            </CRow>

            {/* Danh mục */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="category" className="col-sm-3 col-form-label">
                Danh mục
              </CFormLabel>
              <CCol sm="9">
                <CFormSelect
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Chọn loại sản phẩm</option>
                  <option value="Tay ga">Tay ga</option>
                  <option value="Xe số">Xe số</option>
                  <option value="Xe tay côn">Xe tay côn</option>
                  <option value="Xe moto">Xe moto</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Ảnh sản phẩm */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="image" className="col-sm-3 col-form-label">
                Ảnh sản phẩm
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {image && <p className="text-muted">File đã chọn: {image.name}</p>}
              </CCol>
            </CRow>

            {/* Nút gửi form */}
            <div className="text-center">
              <CButton
                type="submit"
                color="primary"
                onClick={handleAddProduct}
                disabled={loading || isSubmitted}
              >
                {loading ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddProduct
