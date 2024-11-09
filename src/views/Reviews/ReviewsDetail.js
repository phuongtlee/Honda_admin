import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CButton, CRow, CCol, CCardText } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilStar, cilStarHalf } from '@coreui/icons'

const ReviewDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Get the review data passed from the Reviews page
  const review = location.state?.review

  // If no review is found, display a message
  if (!review) {
    return <div className="text-center">Review not found</div>
  }

  const handleGoBack = () => {
    navigate('/reviews') // Navigate back to the reviews list page
  }

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStars = rating % 1 >= 0.5 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStars

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <CIcon key={`full-${index}`} icon={cilStar} style={{ color: '#FFD700' }} />
        ))}
        {[...Array(halfStars)].map((_, index) => (
          <CIcon key={`half-${index}`} icon={cilStarHalf} style={{ color: '#FFD700' }} />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <CIcon key={`empty-${index}`} icon={cilStar} style={{ color: '#ddd' }} />
        ))}
      </>
    )
  }

  return (
    <CRow className="min-vh-100 d-flex justify-content-center align-items-center">
      <CCol xs={12} sm={8} md={6} lg={4}>
        <CCard className="shadow-sm mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
            <h4>Chi tiết đánh giá</h4>
            <CButton onClick={handleGoBack} color="secondary">
              Trở lại
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <strong>Tên nhân viên:</strong>
              </CCol>
              <CCol sm={8}>{review.staffName}</CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol sm={4}>
                <strong>Đánh giá:</strong>
              </CCol>
              <CCol sm={8}>
                {renderStars(review.rating)} {/* Display stars */}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol sm={4}>
                <strong>Lịch sử bảo trì:</strong>
              </CCol>
              <CCol sm={8}>{review.scheduleId}</CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol sm={4}>
                <strong>Ngày tạo:</strong>
              </CCol>
              <CCol sm={8}>{new Date(review.createdAt).toLocaleDateString()}</CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol sm={4}>
                <strong>Bình luận:</strong>
              </CCol>
              <CCol sm={8}>
                <CCardText>{review.comment}</CCardText>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReviewDetail
