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
      }
    }
  }

  const handleSave = async () => {
    try {
      const updatedBanner = {
        id: banner.id,
        title,
        newsContent: description,
        imageUrl: imageFile ? imageFile : imageUrl,
      }

      const formData = new FormData()
      formData.append('id', updatedBanner.id)
      formData.append('title', updatedBanner.title)
      formData.append('newsContent', updatedBanner.newsContent)

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
      style={{ height: '100vh' }}
    >
      <CCard className="mb-4" style={{ width: '80%', maxWidth: '800px' }}>
        <CCardHeader className="text-center fw-bold" style={{ fontSize: 24 }}>
          Cập Nhật Banner
        </CCardHeader>
        <CCardBody>
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
                  custom
                  accept="image/*"
                />
                {/* Hiển thị tên file đã chọn (nếu có) */}
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
                    alt="Current banner"
                    style={{ width: '100%', maxWidth: '200px', objectFit: 'cover' }}
                  />
                </CCol>
              </CRow>
            )}

            {/* Nút Lưu và Quay lại */}
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

export default UpdateBanner
