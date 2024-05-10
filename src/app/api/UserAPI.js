import apibase from './BaseAPI'
import lib from '../biz/lib'

const login = async (params) => {
  const url = `/users/login`
  const payload = {
    personal: {
      email: params.email,
      password: params.password,
    },
    role: params.role,
  }
  // lib.log(payload)
  try {
    const result = await apibase.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

const forgotPassword = async (params) => {
  const url = `/users/forgotPassword`
  const payload = {
    personal: {
      email: params.email,
    },
    role: params.role,
  }
  // lib.log(payload)
  try {
    const result = await apibase.post(url, payload)
    // lib.log(result.data)
    return result.data
  } catch (err) {
    throw err
  }
}

const getById = async (params) => {
  const url = `/users/getById`

  try {
    const res = await apibase.post(url, params)
    return res.data
  } catch (err) {
    throw err
  }
}

const updateProfile = async (params) => {
  lib.log('update profile API')
  lib.log(params)
  const url = 'users/updateProfile';
  try {
    const res = await apibase.post(url, params)
    return res.data
  } catch (err) {
    throw err;
  }
}

const passwordCompare = async (params) => {
  const url = 'users/comparePassword';
  try {
    const res = await apibase.post(url, params);
    return res.data;
  } catch(err) {
    throw err;
  }
}

const uploadCompanyLogo = async (userId, codebase64) => {
  const paramss = {
      id: userId,
      codebase64: codebase64,
      fileName: 'companyLogo'
  };
  // lib.log(paramss)
  const url = `/users/uploadImage/CompanyLogo`;
  try {
      const result = await apibase.post(url, paramss)     
      return result.data;
  } catch (err) {
      throw err;
  }
}

const isEmailUnique = async(params) => {
  const url = 'users/isEmailUnique';
  try {
    const res = await apibase.post(url, params);
    return res.data;
  } catch(err) {
    throw err;
  }
}

const isCompanyEmailUnique = async(params) => {
  const url = 'users/isCompanyEmailUnique';
  try {
    const res = await apibase.post(url, params);
    return res.data;
  } catch(err) {
    throw err;
  }
}

export default{
  login: login,
  forgotPassword: forgotPassword,
  getById: getById,
  updateProfile: updateProfile,
  passwordCompare: passwordCompare,
  uploadCompanyLogo: uploadCompanyLogo,
  isEmailUnique: isEmailUnique,
  isCompanyEmailUnique: isCompanyEmailUnique
}

