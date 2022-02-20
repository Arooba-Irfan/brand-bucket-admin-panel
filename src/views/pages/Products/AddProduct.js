import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import axios from 'axios'
import { cilPlus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AddProduct = () => {
  const [categories, setcategories] = useState([])
  const [brands, setbrands] = useState([])
  const [variations, setvariations] = useState([
    {
      images: '',
      color: '',
      sizes: [
        {
          name: '',
          stock: '',
        },
      ],
    },
  ])

  useEffect(() => {
    function fetchCategories() {
      axios.get('http://localhost:8000/api/categories').then((response) => {
        console.log('response after query', response.data.data.categories)
        setcategories(response.data.data.categories)
      })

      axios.get('http://localhost:8000/api/brands').then((response) => {
        console.log('response after query', response.data.data.brands)
        setbrands(response.data.data.brands)
      })
    }

    fetchCategories()
  }, [])

  const handleAddVariation = () => {
    setvariations([...variations, { images: '', color: '' }])
  }

  const handleRemoveVariation = (index) => {
    const list = [...variations]
    list.splice(index, 1)
    setvariations(list)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Product Details</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="exampleFormControlInput1">Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      placeholder="Enter Product Name"
                    />
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="exampleFormControlInput1">Price</CFormLabel>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      placeholder="Enter Product Pice"
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Gender</CFormLabel>
                  <CCol xs={6}>
                    <CFormSelect aria-label="Default select example">
                      <option>Select Gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </CFormSelect>
                  </CCol>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Category</CFormLabel>
                  <CCol xs={6}>
                    <CFormSelect aria-label="Default select example">
                      <option>Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={index}>
                          {category.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Brand</CFormLabel>
                  <CCol xs={6}>
                    <CFormSelect aria-label="Default select example">
                      <option>Select Brand</option>
                      {brands.map((brand, index) => (
                        <option key={index} value={index}>
                          {brand.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Choose Image</CFormLabel>
                  <CCol xs={6}>
                    <div className="mb-3">
                      <CFormInput type="file" id="formFile" />
                    </div>
                  </CCol>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12}>
                  <CFormLabel
                    style={{ fontWeight: 'bolder', fontSize: 'large' }}
                    htmlFor="exampleFormControlInput1"
                  >
                    Variations
                  </CFormLabel>
                  {variations.map((variation, index) => (
                    <CForm key={index} className="row g-3">
                      <CCol md={3}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Image</CFormLabel>
                        <CFormInput type="file" id="formFile" />
                      </CCol>
                      <CCol md={2}>
                        <CFormLabel htmlFor="inputState">Color</CFormLabel>
                        <CFormInput
                          type="text"
                          id="exampleFormControlInput1"
                          placeholder="Enter Color"
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel htmlFor="inputZip">Size</CFormLabel>
                        <CFormSelect aria-label="Default select example">
                          <option>Select Size</option>
                          <option value="s">Small</option>
                          <option value="xl">Extra Small</option>
                          <option value="m">Medium</option>
                          <option value="l">Large</option>
                          <option value="xl">Extra Large</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={2}>
                        <CFormLabel htmlFor="inputZip">Stock</CFormLabel>
                        <CFormInput
                          type="text"
                          id="exampleFormControlInput1"
                          placeholder="Enter Item Stock"
                        />
                      </CCol>
                      <CCol className="mb-3" md={1}>
                        <CFormLabel htmlFor="inputZip" style={{ color: 'white' }}>
                          Remove
                        </CFormLabel>
                        <CButton color="dark" onClick={handleRemoveVariation}>
                          <CIcon icon={cilX} />
                        </CButton>
                      </CCol>
                    </CForm>
                  ))}
                </CCol>
              </CRow>
              <CRow>
                <CCol md={2}>
                  <CButton color="dark" onClick={handleAddVariation}>
                    <CIcon icon={cilPlus} />
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddProduct
