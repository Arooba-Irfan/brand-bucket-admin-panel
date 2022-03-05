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

const Brands = () => {
  const [brands, setbrands] = useState([])
  const [loading, setloading] = useState(false)
  const history = useHistory()
  useEffect(() => {
    // setactionloading(true)
    function fetchBrands() {
      setloading(true)
      axios.get('https://brand-bucket.herokuapp.com/api/brands').then((response) => {
        console.log('response after query', response.data.data.brands)
        setbrands(response.data.data.brands)
        setloading(false)
      })
    }

    fetchBrands()
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCallout color="info" className="bg-white">
          <CButton
            color="dark"
            onClick={() => {
              history.push('/add-brand')
            }}
          >
            Add Brand
          </CButton>
        </CCallout>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Brands List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              {loading ? (
                <div className="overlay">
                  <CSpinner />
                </div>
              ) : (
                brands.map((brand, index) => (
                  <CTableBody key={index}>
                    <CTableRow>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{brand.name}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon
                          onClick={() =>
                            history.push({
                              pathname: '/add-brand',
                              state: { id: brand._id },
                            })
                          }
                          style={{ marginRight: 15, cursor: 'pointer' }}
                          icon={cilPencil}
                        />
                        <CIcon
                          onClick={() => history.push('/add-brand')}
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

export default Brands
