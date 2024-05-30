import { baseAPI } from './BaseAPI.js'

const search = async (search, paging) => {
  const url = `/eTenancy/search`
  const payload = {
    search: search,
    paging: paging,
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

// const previewAgreement = async (params) => {
//   const url = `/eTenancy/previewAgreement`
//   const payload = {
//     email: params.email,
//     password: params.password,
//     role: params.role,
//   }
//   try {
//     const result = await baseAPI.post(url, payload)
//     return result.data
//   } catch (err) {
//     throw err
//   }
// }

// const preview = async (params) => {
//   const url = `/user/login`
//   const payload = {
//     email: params.email,
//     password: params.password,
//     role: params.role,
//   }
//   try {
//     const result = await baseAPI.post(url, payload)
//     return result.data
//   } catch (err) {
//     throw err
//   }
// }

export const eTenancyAPI = {
  search: search,
  // previewAgreement: previewAgreement, 
  // save: save,
  // update: update,
  // getById: getById
}
