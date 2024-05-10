import apiUser from '../api/UserAPI'

const login = async (params) => {
  return await apiUser.login(params)
}

const forgotPassword = async (params) => {
  return await apiUser.forgotPassword(params)
}

const getById = async (params) => {
  return await apiUser.getById(params)
}

const updateProfile = async (params) => {
  return await apiUser.updateProfile(params)
}

const passwordCompare = async(params) => {
  return await apiUser.passwordCompare(params);
}

//userBiz.js
const uploadCompanyLogo = async (userId, codebase64) => {
  const result = await apiUser.uploadCompanyLogo(userId, codebase64)
  return result;
}

const isEmailUnique = async (params) => {
  const result = await apiUser.isEmailUnique(params);
  return result;
}

const isCompanyEmailUnique = async (params) => {
  const result = await apiUser.isCompanyEmailUnique(params);
  return result;
}

export default {
  login: login,
  forgotPassword: forgotPassword,
  getById: getById,
  updateProfile: updateProfile,
  uploadCompanyLogo: uploadCompanyLogo,
  passwordCompare: passwordCompare,
  uploadCompanyLogo: uploadCompanyLogo,
  isEmailUnique: isEmailUnique,
  isCompanyEmailUnique: isCompanyEmailUnique
}
