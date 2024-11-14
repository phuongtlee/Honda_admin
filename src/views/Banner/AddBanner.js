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
  CFormTextarea,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AddBanner = () => {
  const [title, setTitle] = useState('')
  const [newsContent, setNewsContent] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAddBanner = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage('')

    if (!title || !newsContent || !image) {
      setError('Tất cả các trường phải được điền đầy đủ và chọn ảnh.')
      console.error('Validation error: All fields must be filled and an image selected.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('newsContent', newsContent)
      formData.append('createdAt', new Date().toISOString())
      formData.append('image', image)

      const response = await fetch('https://localhost:7190/api/Banner/add', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      const responseBody = await response.json()
      if (!response.ok) {
        console.error('API error:', responseBody)
        throw new Error(responseBody.message || 'Lỗi khi thêm banner.')
      }

      setSuccessMessage('Banner đã được thêm thành công!')
      setImage(null)
      navigate(-1)
    } catch (error) {
      setError(`Lỗi khi thêm banner: ${error.message}`)
      console.error('Error adding banner:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh', background: '#f4f5f7' }}
    >
      <CCard className="shadow-lg" style={{ width: '40%', borderRadius: '10px' }}>
        <CCardHeader
          className="text-center bg-primary text-white"
          style={{ borderRadius: '10px 10px 0 0' }}
        >
          <h5>Thêm Banner</h5>
        </CCardHeader>
        <CCardBody>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          {successMessage && (
            <div className="alert alert-success text-center">{successMessage}</div>
          )}

          <CForm onSubmit={handleAddBanner}>
            <CRow className="mb-3">
              <CFormLabel htmlFor="title" className="col-sm-3 col-form-label">
                Tiêu đề
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel htmlFor="newsContent" className="col-sm-3 col-form-label">
                Nội dung tin tức
              </CFormLabel>
              <CCol sm="9">
                <CFormTextarea
                  id="newsContent"
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Nhập nội dung tin tức"
                  rows="4"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel htmlFor="image" className="col-sm-3 col-form-label">
                Ảnh banner
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {image && <p className="text-muted mt-1">File đã chọn: {image.name}</p>}
              </CCol>
            </CRow>

            <div className="text-center mt-4">
              <CButton type="submit" color="primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Đang thêm...' : 'Thêm Banner'}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddBanner
