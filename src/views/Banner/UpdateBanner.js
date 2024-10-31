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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilArrowLeft } from '@coreui/icons'

const UpdateBanner = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { banner } = location.state || {}

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState(null)
  const [fileChanged, setFileChanged] = useState(false)

  useEffect(() => {
    if (banner) {
      setTitle(banner.title)
      setDescription(banner.newsContent)
      setImageUrl(banner.imageUrl || '')
    }
  }, [banner])

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
      formData.append('id', banner.id)
      formData.append('title', title)
      formData.append('newsContent', description)

      if (imageFile) {
        formData.append('image', imageFile)
      } else {
        formData.append('imageUrl', imageUrl)
      }

      const response = await fetch(`https://localhost:7190/api/Banner/update/${banner.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Cập nhật banner thất bại')
      }

      const result = await response.json()
      console.log('Cập nhật banner thành công:', result)

      navigate(-2)
    } catch (error) {
      console.error('Có lỗi xảy ra khi cập nhật banner:', error)
    }
  }

  const handleBack = () => {
    navigate('/banner')
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
          maxHeight: '90vh', // Giới hạn chiều cao của CCARD
          overflow: 'hidden', // Ẩn các thành phần tràn
        }}
      >
        <CCardHeader
          className="text-center fw-bold"
          style={{ fontSize: 24, backgroundColor: '#007bff', color: '#fff' }}
        >
          Cập Nhật Banner
        </CCardHeader>
        <CCardBody style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          {' '}
          {/* Thêm thanh cuộn nếu cần */}
          <CForm>
            {/* Tên Banner */}
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormInput
                  type="text"
                  id="title"
                  label="Tên Banner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ borderRadius: '0.25rem' }}
                  placeholder="Nhập tên banner"
                />
              </CCol>
            </CRow>

            {/* Mô tả */}
            <CRow className="mb-3">
              <CCol sm={12}>
                <CFormTextarea
                  id="newsContent"
                  label="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ borderRadius: '0.25rem' }}
                  rows="4"
                  placeholder="Nhập mô tả cho banner"
                />
              </CCol>
            </CRow>

            {/* Tải lên hình ảnh */}
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

            {/* Hiển thị ảnh hiện tại */}
            {imageUrl && !imageFile && (
              <CRow className="mb-3">
                <CCol sm={12} className="text-center">
                  <img
                    src={imageUrl}
                    alt="Current banner"
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      objectFit: 'cover',
                      border: '1px solid #ddd',
                      borderRadius: '0.25rem',
                    }}
                  />
                </CCol>
              </CRow>
            )}

            {/* Nút Lưu và Quay lại */}
            <CRow className="text-center mt-4">
              <CCol xs={6}>
                <CButton
                  color="primary"
                  onClick={handleSave}
                  style={{ width: '100%', borderRadius: '0.25rem' }}
                >
                  <CIcon icon={cilSave} className="me-2" />
                  Lưu thay đổi
                </CButton>
              </CCol>
              <CCol xs={6}>
                <CButton
                  color="secondary"
                  onClick={handleBack}
                  style={{ width: '100%', borderRadius: '0.25rem' }}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
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

export default UpdateBanner
