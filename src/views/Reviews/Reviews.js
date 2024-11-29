import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CPagination,
  CPaginationItem,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const StarRating = ({ rating }) => {
  const fullStar = '★'
  const emptyStar = '☆'

  const stars = Array(5)
    .fill(emptyStar)
    .map((star, index) => (index < rating ? fullStar : emptyStar))

  return <span>{stars.join('')}</span>
}

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
  const reviewsPerPage = 5

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/Review/getReviews?page=${currentPage}&size=${reviewsPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Fetched Reviews:', data)

        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setReviewsData(sortedData || [])
        setTotalPages(Math.ceil(sortedData.length / reviewsPerPage)) // Set total pages for pagination
      } catch (error) {
        console.error('Error fetching review data:', error)
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchReviews()
  }, [currentPage, searchQuery])

  useEffect(() => {
    let filtered = reviewsData

    if (selectedMonth) {
      filtered = filtered.filter((review) => {
        const reviewDate = new Date(review.createdAt)
        const reviewMonth = reviewDate.getMonth() + 1
        return reviewMonth === parseInt(selectedMonth, 10)
      })
    }

    filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setFilteredReviews(filtered)
    setTotalPages(Math.ceil(filtered.length / reviewsPerPage))
    setCurrentPage(1)
  }, [selectedMonth, reviewsData])

  const navigate = useNavigate()

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (review) => {
    navigate('/reviewDetail', { state: { review } })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
  }

  return (
    <>
      {showAlert && successMessage && (
        <CAlert
          color="success"
          className="text-center"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          {successMessage}
        </CAlert>
      )}

      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
          <span>Danh sách đánh giá</span>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm đánh giá..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-2"
              style={{ maxWidth: '250px' }}
            />
            <CFormSelect
              aria-label="Sort by Month"
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ maxWidth: '150px' }}
            >
              <option value="">Tất cả tháng</option>
              <option value="1">Tháng 1</option>
              <option value="2">Tháng 2</option>
              <option value="3">Tháng 3</option>
              <option value="4">Tháng 4</option>
              <option value="5">Tháng 5</option>
              <option value="6">Tháng 6</option>
              <option value="7">Tháng 7</option>
              <option value="8">Tháng 8</option>
              <option value="9">Tháng 9</option>
              <option value="10">Tháng 10</option>
              <option value="11">Tháng 11</option>
              <option value="12">Tháng 12</option>
            </CFormSelect>
          </div>
        </CCardHeader>
        <CCardBody>
          {error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4 shadow-sm" hover responsive>
                <CTableHead className="text-nowrap bg-light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Tên nhân viên</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Đánh giá</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Lịch sử bảo trì</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Ngày tạo</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews
                      .slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
                      .map((review, index) => (
                        <CTableRow
                          key={index}
                          onClick={() => handleRowClick(review)}
                          style={{ cursor: 'pointer' }}
                        >
                          <CTableDataCell className="text-center">
                            {review.staffName}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <StarRating rating={review.rating} />{' '}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {review.scheduleId}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center">
                        Không có đánh giá
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              <div className="text-center mb-4">
                <CPagination align="center" aria-label="Page navigation example">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    &laquo;
                  </CPaginationItem>
                  {[...Array(totalPages).keys()].map((page) => (
                    <CPaginationItem
                      key={page + 1}
                      active={page + 1 === currentPage}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    &raquo;
                  </CPaginationItem>
                </CPagination>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Reviews
