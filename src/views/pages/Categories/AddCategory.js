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

import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const AddCategory = () => {
  const history = useHistory()
  const [loading, setloading] = useState(false)
  const [catData, setcatData] = useState({
    name: ' ',
    image: ' ',
  })

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
            'http://localhost:8000/api/categories',
            {
              name: catData.name,
              image: data.url,
            },
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZGIyMTg5MjhhYzI5ZDE0MjJiMGRjNiIsImlhdCI6MTY0Mjg1MTQ0OSwiZXhwIjoxNjUwNjI3NDQ5fQ.mTwAZwrQ2Ww0uRJxwwbRJ3_681f9DCibOHop7VoXjMM`,
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

export default AddCategory
