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

const Orders = () => {
  const [orders, setorders] = useState([])
  const [loading, setloading] = useState(false)
  const history = useHistory()
  useEffect(() => {
    // setactionloading(true)
    function fetchOrders() {
      setloading(true)
      axios.get('https://brand-bucket.herokuapp.com/api/orders').then((response) => {
        console.log('response after query', response.data.data.orders)
        setorders(response.data.data.orders)
        setloading(false)
      })
    }

    fetchOrders()
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Orders List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Order ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              {loading ? (
                <div className="overlay">
                  <CSpinner />
                </div>
              ) : (
                orders.map((order, index) => (
                  <CTableBody key={index}>
                    <CTableRow>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{order._id}</CTableDataCell>
                      <CTableDataCell>{order.subTotal}</CTableDataCell>
                      <CTableDataCell>{order.orderDate}</CTableDataCell>
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

export default Orders
