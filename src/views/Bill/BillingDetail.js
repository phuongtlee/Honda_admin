import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CAlert,
  CPagination,
  CPaginationItem,
  CFormInput,
  CTooltip,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const BillingDetail = () => {
  const [billings, setBillings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const billingsPerPage = 5

  const navigate = useNavigate()

  const fetchBillings = async () => {
    try {
      const response = await fetch(
        `https://localhost:7190/allBillings?page=${currentPage}&size=${billingsPerPage}&search=${searchQuery}`,
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setBillings(sortedData || [])
      setTotalPages(Math.ceil(sortedData.length / billingsPerPage))
      console.log(sortedData)
    } catch (err) {
      setError('Error fetching data: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBillings()
  }, [currentPage, searchQuery])

  const handleRowClick = (billing) => {
    navigate('/billingDetailPage', { state: { billing } })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-danger">{error}</div>

  return (
    <>
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
          <span>Billing List</span>
          <CFormInput
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-50"
          />
        </CCardHeader>
        <CCardBody>
          <CTable striped hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Tên khách hàng</CTableHeaderCell>
                <CTableHeaderCell>Tên xe</CTableHeaderCell>
                <CTableHeaderCell>Tên nhân viên</CTableHeaderCell>
                <CTableHeaderCell>Ngày sửa chữa</CTableHeaderCell>
                <CTableHeaderCell>Tổng tiền</CTableHeaderCell>
                <CTableHeaderCell>Dịch vụ</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {billings
                .slice((currentPage - 1) * billingsPerPage, currentPage * billingsPerPage)
                .map((billing, index) => (
                  <CTableRow
                    key={index}
                    onClick={() => handleRowClick(billing)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CTableDataCell>{billing.customerName}</CTableDataCell>
                    <CTableDataCell>{billing.carName}</CTableDataCell>
                    <CTableDataCell>{billing.staffName}</CTableDataCell>
                    <CTableDataCell>{billing.date}</CTableDataCell>
                    <CTableDataCell>{billing.totalCost} VND</CTableDataCell>
                    <CTableDataCell>
                      {billing.services.map((service) => (
                        <div key={service.id}>
                          {service.name} - {service.price} VND
                        </div>
                      ))}
                    </CTableDataCell>
                  </CTableRow>
                ))}
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
        </CCardBody>
      </CCard>
    </>
  )
}

export default BillingDetail
