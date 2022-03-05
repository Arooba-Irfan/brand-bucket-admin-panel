import React, { Fragment, useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCallout,
  CSpinner,
} from '@coreui/react'
import { DocsCallout, DocsExample } from 'src/components'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setloading] = useState(false)
  const history = useHistory()
  useEffect(() => {
    // setactionloading(true)
    function fetchProducts() {
      setloading(true)
      axios.get('https://brand-bucket.herokuapp.com/api/products').then((response) => {
        console.log('response after query', response.data.data.products)
        setProducts(response.data.data.products)
        setloading(false)
      })
    }

    fetchProducts()
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCallout color="info" className="bg-white">
          <CButton
            color="dark"
            onClick={() => {
              history.push('/add-product')
            }}
          >
            Add Product
          </CButton>
        </CCallout>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Products List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              {loading ? (
                <div className="overlay">
                  <CSpinner />
                </div>
              ) : (
                products.map((product, index) => (
                  <CTableBody key={index}>
                    <CTableRow>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{product.productName}</CTableDataCell>
                      <CTableDataCell>
                        {product.categoryId ? product.categoryId.name : '---'}
                      </CTableDataCell>
                      <CTableDataCell>{product.price}</CTableDataCell>
                      <CTableDataCell>{product.gender}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon
                          onClick={() =>
                            history.push({
                              pathname: '/add-product',
                              state: { id: product._id },
                            })
                          }
                          style={{ marginRight: 15, cursor: 'pointer' }}
                          icon={cilPencil}
                        />
                        <CIcon
                          onClick={() => history.push('/add-product')}
                          style={{ cursor: 'pointer' }}
                          icon={cilTrash}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                ))
              )}
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products
