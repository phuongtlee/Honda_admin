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
} from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const AllProducts = () => {
  const [productData, setProductData] = useState([]) // State for products data
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('') // Search query state
  const [showAlert, setShowAlert] = useState(true)
  const productsPerPage = 10 // Products per page

  const location = useLocation()
  const successMessage = location.state?.successMessage || ''

  // Fetch products data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://localhost:7190/api/Product/all?page=${currentPage}&size=${productsPerPage}&search=${searchQuery}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
        setProductData(data || []) // Assuming 'items' contains the list of products
        setTotalPages(data.totalPages || 1) // Set total pages for pagination
      } catch (error) {
        console.error('Error fetching product data:', error)
        setError(`Error fetching data: ${error.message}`)
      }
    }

    fetchProducts()
  }, [currentPage, searchQuery])

  const navigate = useNavigate()

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (product) => {
    navigate('/productDetail', { state: { product } })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset page to 1 when search query changes
  }

  const handleAddProduct = () => {
    navigate('/addProduct') // Navigate to the product addition page
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

      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Danh sách tất cả sản phẩm</span>
          <div>
            <CButton color="primary" onClick={handleAddProduct}>
              Thêm sản phẩm mới
            </CButton>
          </div>
          <div>
            <CFormInput
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </CCardHeader>
        <CCardBody>
          {error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <>
              <CTable align="middle" className="mb-4 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Tên sản phẩm
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Mô tả
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Thể loại
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">Giá</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-start">
                      Ngày thêm
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {productData.length > 0 ? (
                    productData.map((product, index) => (
                      <CTableRow
                        key={index}
                        onClick={() => handleRowClick(product)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CTableDataCell className="text-start">
                          <div>{product.nameProduct}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>
                            {product.description.length > 50
                              ? product.description.substring(0, 50) + '...'
                              : product.description}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell className="text-start">
                          <div>{product.category}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{product.price.toLocaleString()} VNĐ</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-start">
                          <div>{new Date(product.addedDate).toLocaleDateString()}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        Không có sản phẩm
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              <div className="text-center mb-4">
                <CPagination aria-label="Page navigation example" size="sm">
                  {[...Array(totalPages).keys()].map((page) => (
                    <CPaginationItem
                      key={page + 1}
                      active={page + 1 === currentPage}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </CPaginationItem>
                  ))}
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
