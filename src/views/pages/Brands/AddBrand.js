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
import PropTypes from 'prop-types'

import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

const AddBrand = (props) => {
  const history = useHistory()
  const location = useLocation()
  const [singleBrand, setsingleBrand] = useState({})

  const [loading, setloading] = useState(false)
  const [catData, setcatData] = useState({
    name: ' ',
    image: ' ',
  })
  useEffect(() => {
    if (location?.state?.id) {
      const { id } = location && location.state
      if (id) {
        function fetchBrand() {
          axios
            .get('https://brand-bucket.herokuapp.com/api/brands/brand/' + id)
            .then((response) => {
              console.log('response after query', response.data.data.brand)
              setsingleBrand(response.data.data.brand)
            })
        }
        fetchBrand()
      }
    }
  }, [])

  useEffect(() => {
    console.log('singleBrand', singleBrand)
    setcatData({
      name: singleBrand.name,
      image: singleBrand.image,
    })
  }, [singleBrand])

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
            'https://brand-bucket.herokuapp.com/api/brands',
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
            history.push('/brands')
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
            <strong>Add Brand Details</strong>
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
                      placeholder="Enter Brand Name"
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
                      {singleBrand?.image ? (
                        <div style={{ width: '270px', height: '50px', overflow: 'scroll' }}>
                          {singleBrand?.image}
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
AddBrand.propTypes = {
  userToken: PropTypes.string,
}

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.user.data.token,
  }
}

export default connect(mapStateToProps, null)(AddBrand)
