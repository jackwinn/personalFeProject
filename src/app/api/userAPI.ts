import {baseAPI} from './BaseAPI'
import {LoginParams} from '../interfaces/modules/userModule.interface'

const login = async (params: LoginParams) => {
  const url = `/users/login`
  const payload = {
    email: params.email,
    password: params.password,
    role: params.role,
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

export const userAPI = {
  login: login,
  // save: save,
  // update: update,
  // getById: getById
}
