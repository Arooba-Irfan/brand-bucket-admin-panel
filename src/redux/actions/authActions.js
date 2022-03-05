import axios from 'axios'
import { actionTypes } from '../common/actionTypes'
const SERVER_URL = 'https://brand-bucket.herokuapp.com'

export const loginAction = (body, navigate) => async (dispatch) => {
  console.log('LOGIN BODY', body)
  let response
  try {
    response = await axios.post(SERVER_URL + '/api/auth/login', body)
    console.log('LOGIN RESPONSE', response)
    dispatch({
      type: actionTypes.LOGIN,
      payload: {
        response,
      },
    })
    navigate()
  } catch (error) {
    console.log('error', error.message)
  }
  return response
}
