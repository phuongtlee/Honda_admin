import React, { useEffect, useState } from 'react'
import {
  CButton,
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
  CTooltip,
} from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const AllProducts = () => {
  const [productData, setProductData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlert, setShowAlert] = useState(true)
  const productsPerPage = 5

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''
  const navigate = useNavigate()

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://localhost:7190/api/Product/all?page=${currentPage}&size=${productsPerPage}&search=${searchQuery}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      const sortedData = data?.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))

      setProductData(sortedData || [])
      setTotalPages(Math.ceil(data.length / productsPerPage))
    } catch (error) {
      console.error('Error fetching product data:', error)
      setError(`Error fetching data: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (product) => {
    navigate('/productDetail', { state: { product } })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleAddProduct = () => {
    navigate('/addProduct')
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const response = await fetch(`https://localhost:7190/api/Product/delete/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          alert('Sản phẩm đã được xóa thành công.')
          await fetchProducts()
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
          <span>Danh sách tất cả sản phẩm</span>
          <div className="d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-3"
            />
            <CButton
              color="primary"
              onClick={handleAddProduct}
              style={{
                background: '#ff8000',
                fontSize: '0.9rem',
                padding: '6px 18px',
                marginRight: '10px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 123, 255, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              + Thêm sản phẩm mới
            </CButton>
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
                    <CTableHeaderCell className="text-start">Tên sản phẩm</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Mô tả</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Thể loại</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Giá</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Ngày thêm</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Hành động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {productData.length > 0 ? (
                    productData
                      .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                      .map((product, index) => (
                        <CTableRow
                          key={index}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRowClick(product)}
                        >
                          <CTableDataCell className="text-start">
                            {product.nameProduct}
                          </CTableDataCell>
                          <CTableDataCell className="text-start">
                            {product.description.length > 50
                              ? product.description.substring(0, 50) + '...'
                              : product.description}
                          </CTableDataCell>
                          <CTableDataCell className="text-start">{product.category}</CTableDataCell>
                          <CTableDataCell className="text-start">
                            {product.price.toLocaleString()} VNĐ
                          </CTableDataCell>
                          <CTableDataCell className="text-start">
                            {new Date(product.addedDate).toLocaleDateString()}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CTooltip content="Xóa sản phẩm này">
                              <CButton
                                color="danger"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(product.id)
                                }}
                              >
                                Xóa
                              </CButton>
                            </CTooltip>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        Không có sản phẩm
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

export default AllProducts
