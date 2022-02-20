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

const Categories = () => {
  const [categories, setcategories] = useState([])
  const [loading, setloading] = useState(false)

  const history = useHistory()
  useEffect(() => {
    // setactionloading(true)
    function fetchCategories() {
      setloading(true)
      axios.get('http://localhost:8000/api/categories').then((response) => {
        console.log('response after query', response.data.data.categories)
        setcategories(response.data.data.categories)
        setloading(false)
      })
    }

    fetchCategories()
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
            Add Category
          </CButton>
        </CCallout>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Categories List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              {loading ? (
                <CSpinner />
              ) : (
                categories.map((category, index) => (
                  <CTableBody key={index}>
                    <CTableRow>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{category.name}</CTableDataCell>
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

export default Categories
