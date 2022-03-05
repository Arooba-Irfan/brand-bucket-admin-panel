import React, { Fragment, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { cilPlus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const AddProduct = (props) => {
  const history = useHistory()
  const location = useLocation()
  const [loading, setloading] = useState(false)
  const [singleProduct, setsingleProduct] = useState({})
  const [productName, setproductName] = useState('')
  const [gender, setgender] = useState('')
  const [price, setprice] = useState('')
  const [SKU, setSKU] = useState('')
  const [categoryId, setcategoryId] = useState('')
  const [brandId, setbrandId] = useState('')
  const [image, setimage] = useState('')
  const [categories, setcategories] = useState([])
  const [brands, setbrands] = useState([])
  const [beforeURLVarImages, setbeforeURLVarImages] = useState([])
  const [afterURLVarImages, setafterURLVarImages] = useState([])
  const [variations, setvariations] = useState([
    {
      color: '',
      images: [''],
      sizes: [
        {
          name: '',
          stock: '',
        },
      ],
    },
  ])
  console.log('location', location)
  useEffect(() => {
    if (location?.state?.id) {
      const { id } = location && location.state
      if (id) {
        function fetchProduct() {
          axios.get('https://brand-bucket.herokuapp.com/api/product/' + id).then((response) => {
            console.log('response after query', response.data.data.product)
            setsingleProduct(response.data.data.product)
          })
        }
        fetchProduct()
      }
    }
  })

  useEffect(() => {
    console.log('singleProduct', singleProduct, singleProduct?.variation)
    setproductName(singleProduct.productName)
    setgender(singleProduct.gender)
    setprice(singleProduct.price)
    setSKU(singleProduct.SKU)
    setcategoryId(singleProduct?.categoryId?._id)
    setbrandId(singleProduct?.brandId?._id)
    let arr = []
    singleProduct?.variation?.forEach((element, i) => {
      arr.push({
        color: element.color,
        images: [...element.images],
        sizes: element.sizes.map((element) => {
          return {
            name: element.name,
            stock: element.stock,
          }
        }),
      })
    })
    console.log('arr', arr)
    setvariations(arr)
  }, [singleProduct])
  useEffect(() => {
    console.log('variations', variations)
  }, [variations])

  useEffect(() => {
    function fetchCategories() {
      axios.get('https://brand-bucket.herokuapp.com/api/categories').then((response) => {
        console.log('response after query', response.data.data.categories)
        setcategories(response.data.data.categories)
      })

      axios.get('https://brand-bucket.herokuapp.com/api/brands').then((response) => {
        console.log('response after query', response.data.data.brands)
        setbrands(response.data.data.brands)
      })
    }

    fetchCategories()
  }, [])

  const handleAddVariation = () => {
    setvariations([...variations, { images: '', color: '', sizes: [{ name: '', stock: '' }] }])
  }
  const handleAddSize = (index) => {
    console.log('index', index)
    const vart = [...variations]
    vart[index].sizes.push({ name: '', stock: '' })
    console.log('vart', vart)
    setvariations(vart)
  }
  const handleRemoveSize = (index) => {
    console.log('index', index)
    const vart = [...variations]
    vart[index].sizes.splice(index, 1)
    console.log('vart', vart)
    setvariations(vart)
  }

  const handleRemoveVariation = (index) => {
    const list = [...variations]
    list.splice(index, 1)
    setvariations(list)
  }

  const handleSubmit = () => {
    setloading(true)

    for (let index = 0; index < beforeURLVarImages.length; index++) {
      const data = new FormData()
      data.append('file', beforeURLVarImages[index])
      data.append('upload_preset', 'ksdxgav7')
      data.append('cloud_name', 'dwlpeiz2a')

      fetch('https://api.cloudinary.com/v1_1/dwlpeiz2a/image/upload', {
        method: 'post',
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          setafterURLVarImages([...afterURLVarImages, data.url])
        })
    }

    let modifiedvariations = variations.map((element, i) => {
      return { ...element, images: [afterURLVarImages[i]] }
    })

    console.log('modifiedvariations', modifiedvariations)

    const data = new FormData()
    data.append('file', image)
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
            'https://brand-bucket.herokuapp.com/api/products',
            {
              gender: gender,
              productName: productName,
              price: price,
              SKU: SKU,
              categoryId: categoryId,
              brandId: brandId,
              discountId: null,
              variation: modifiedvariations,
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
            history.push('/products')
          })
      })
      .catch((err) => console.log('image upload failed!', err))
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
                      placeholder="Enter Product Name"
                      value={productName}
                      onChange={(e) => setproductName(e.target.value)}
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
                      value={price}
                      onChange={(e) => setprice(e.target.value)}
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="exampleFormControlInput1">SKU</CFormLabel>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      placeholder="Enter SKU"
                      value={SKU}
                      onChange={(e) => setSKU(e.target.value)}
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Gender</CFormLabel>
                  <CCol xs={6}>
                    <CFormSelect
                      aria-label="Default select example"
                      value={gender}
                      onChange={(e) => setgender(e.target.value)}
                    >
                      <option>Select Gender</option>
                      <option value="M">Male</option>
                      <option value="W">Female</option>
                    </CFormSelect>
                  </CCol>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Choose Image</CFormLabel>
                  <CCol xs={6}>
                    <div className="mb-3">
                      <CFormInput
                        type="file"
                        id="formFile"
                        name="image"
                        onChange={(e) => {
                          console.log('e', e.target.files[0])
                          setimage(e.target.files[0])
                        }}
                      />
                      {singleProduct?.image ? (
                        <div style={{ width: '270px', height: '50px', overflow: 'scroll' }}>
                          {singleProduct?.image}
                        </div>
                      ) : null}
                    </div>
                  </CCol>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Brand</CFormLabel>
                  <CCol xs={6}>
                    <CFormSelect
                      aria-label="Default select example"
                      value={brandId}
                      onChange={(e) => setbrandId(e.target.value)}
                    >
                      <option>Select Brand</option>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Category</CFormLabel>
                  <CCol xs={6}>
                    <CFormSelect
                      aria-label="Default select example"
                      value={categoryId}
                      onChange={(e) => setcategoryId(e.target.value)}
                    >
                      <option>Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12}>
                  <CFormLabel
                    style={{ fontWeight: 'bolder', fontSize: 'large', marginBottom: '10' }}
                    htmlFor="exampleFormControlInput1"
                  >
                    Variations
                  </CFormLabel>
                  {variations &&
                    variations.map((variation, varIndex) => (
                      <CForm
                        key={varIndex}
                        style={{ backgroundColor: '#EAEDEF', borderRadius: '10px' }}
                        className="row g-3 mt-3 mb-4"
                      >
                        <CCol md={11} className="mt-1">
                          <CFormLabel
                            style={{ fontWeight: '400', fontSize: 'large' }}
                            htmlFor="exampleFormControlInput1"
                          >
                            {`Variation ${varIndex + 1}:`}
                          </CFormLabel>
                        </CCol>
                        <CCol md={1} style={{ textAlign: 'center' }}>
                          <CButton color="dark" onClick={handleRemoveVariation}>
                            <CIcon icon={cilX} />
                          </CButton>
                        </CCol>
                        <CCol md={6} className="mt-0">
                          <CFormLabel htmlFor="exampleFormControlInput1">Image</CFormLabel>
                          <CFormInput
                            type="file"
                            id="formFile"
                            name="image"
                            onChange={(e) => {
                              // const vars = [...variations]
                              // vars[varIndex].images = e.target.files[0]
                              // setvariations(vars)

                              const img = beforeURLVarImages
                              img.push(e.target.files[0])
                              setbeforeURLVarImages(img)
                            }}
                          />
                          {variation?.images?.[0] ? (
                            <div style={{ width: '270px', height: '50px', overflow: 'scroll' }}>
                              {variation?.images?.[0]}
                            </div>
                          ) : null}
                        </CCol>
                        <CCol md={5} className="mt-0">
                          <CFormLabel htmlFor="inputState">Color</CFormLabel>
                          <CFormInput
                            type="text"
                            id="exampleFormControlInput1"
                            placeholder="Enter Color"
                            value={variation?.color}
                            onChange={(e) => {
                              const vars = [...variations]
                              vars[varIndex].color = e.target.value
                              setvariations(vars)
                            }}
                          />
                        </CCol>

                        {variation?.sizes.map((size, index) => (
                          <Fragment key={index}>
                            <CCol md={5}>
                              <CFormLabel htmlFor="exampleFormControlInput1">Size</CFormLabel>
                              <CFormSelect
                                aria-label="Default select example"
                                value={size?.name}
                                onChange={(e) => {
                                  const vars = [...variations]
                                  vars[varIndex].sizes[index].name = e.target.value
                                  setvariations(vars)
                                }}
                              >
                                <option>Select Size</option>
                                <option value="s">Small</option>
                                <option value="xs">Extra Small</option>
                                <option value="m">Medium</option>
                                <option value="l">Large</option>
                                <option value="xl">Extra Large</option>
                              </CFormSelect>
                            </CCol>
                            <CCol md={4}>
                              <CFormLabel htmlFor="inputState">Stock</CFormLabel>
                              <CFormInput
                                type="text"
                                id="exampleFormControlInput1"
                                placeholder="Enter Stock"
                                value={size?.stock}
                                onChange={(e) => {
                                  const vars = [...variations]
                                  vars[varIndex].sizes[index].stock = e.target.value
                                  setvariations(vars)
                                }}
                              />
                            </CCol>
                            {variation.sizes.length > 1 ? (
                              <CCol className="mb-3 text-center" md={1}>
                                <CFormLabel htmlFor="inputZip" style={{ color: '#EAEDEF' }}>
                                  Remove
                                </CFormLabel>
                                <CButton color="dark" onClick={() => handleRemoveSize(varIndex)}>
                                  <CIcon icon={cilX} />
                                </CButton>
                              </CCol>
                            ) : null}
                            <CCol className="mb-3" md={1}>
                              <CFormLabel htmlFor="inputZip" style={{ color: '#EAEDEF' }}>
                                Remove
                              </CFormLabel>
                              <CButton color="dark" onClick={() => handleAddSize(varIndex)}>
                                <CIcon icon={cilPlus} />
                              </CButton>
                            </CCol>
                          </Fragment>
                        ))}
                      </CForm>
                    ))}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={2}>
                  <CButton color="dark" onClick={handleAddVariation}>
                    <CIcon icon={cilPlus} />
                  </CButton>
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

AddProduct.propTypes = {
  userToken: PropTypes.string,
}

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.user.data.token,
  }
}

export default connect(mapStateToProps, null)(AddProduct)
