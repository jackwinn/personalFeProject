import { baseAPI } from './BaseAPI.js'

const search = async (search, page) => {
  const url = `/eTenancy/search`
  const payload = {
    search: search,
    paging: {
      page: page
    },
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

const previewAgreement = async (params) => {
  const url = `/eTenancy/previewAgreement`
  // const payload = {
 
  // }
  try {
    const result = await baseAPI.post(url, params, { responseType: 'arraybuffer' })
    return result.data
  } catch (err) {
    throw err
  }
}

const create = async (params) => {
  const url = `/eTenancy/create`
  const payload = {
   ...params
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

const update = async (params) => {
  const url = `/eTenancy/update`
  const payload = {
    ...params
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

const getById = async (eTenancyId) => {
  const url = `/eTenancy/getById `
  const payload = {
    _id: eTenancyId
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

export const eTenancyAPI = {
  search: search,
  previewAgreement: previewAgreement, 
  create: create,
  update: update,
  getById: getById
}
