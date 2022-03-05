import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'

import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const AddCategory = (props) => {
  const history = useHistory()
  const [loading, setloading] = useState(false)
  const location = useLocation()
  const [singleCategory, setsingleCategory] = useState({})
  const [catData, setcatData] = useState({
    name: ' ',
    image: ' ',
  })

  useEffect(() => {
    if (location?.state?.id) {
      const { id } = location && location.state
      if (id) {
        function fetchCategory() {
          axios
            .get('https://brand-bucket.herokuapp.com/api/categories/category/' + id)
            .then((response) => {
              console.log('response after query', response.data.data.category)
              setsingleCategory(response.data.data.category)
            })
        }
        fetchCategory()
      }
    }
  }, [])

  useEffect(() => {
    console.log('singleCategory', singleCategory)
    setcatData({
      name: singleCategory.name,
      image: singleCategory.image,
    })
  }, [singleCategory])

  const handleSubmit = () => {
    setloading(true)
    const data = new FormData()
    data.append('file', catData.image)
    data.append('upload_preset', 'ksdxgav7')
    data.append('cloud_name', 'dwlpeiz2a')

    fetch('https://api.cloudinary.com/v1_1/dwlpeiz2a/image/upload', {
      method: 'post',
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        axios
          .post(
            'https://brand-bucket.herokuapp.com/api/categories',
            {
              name: catData.name,
              image: data.url,
            },
            {
              headers: {
                Authorization: `Bearer ${props.userToken}`,
              },
            },
          )
          .then((res) => {
            console.log('uploaded =>', res.data)
            setloading(false)
            alert('UPLOADED')
            history.push('/categories')
          })
        console.log('catDataAfter', catData)
      })
      .catch((err) => console.log('image upload failed!', err))
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Category Details</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              {loading && (
                <div className="overlay">
                  <CSpinner />
                </div>
              )}
              <CRow>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="exampleFormControlInput1">Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      placeholder="Enter Category Name"
                      name="name"
                      value={catData.name}
                      onChange={(e) => {
                        setcatData({
                          ...catData,
                          name: e.target.value,
                        })
                      }}
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Choose Image</CFormLabel>
                  <CCol xs={6}>
                    <div className="mb-3">
                      <CFormInput
                        type="file"
                        id="formFile"
                        name="image"
                        onChange={(e) => {
                          setcatData({
                            ...catData,
                            image: e.target.files[0],
                          })
                        }}
                      />
                      {singleCategory?.image ? (
                        <div style={{ width: '270px', height: '50px', overflow: 'scroll' }}>
                          {singleCategory?.image}
                        </div>
                      ) : null}
                    </div>
                  </CCol>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <CButton color="dark" variant="outline" onClick={handleSubmit}>
                    Add
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

AddCategory.propTypes = {
  userToken: PropTypes.string,
}

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.user.data.token,
  }
}

export default connect(mapStateToProps, null)(AddCategory)
