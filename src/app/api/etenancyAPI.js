import {baseAPI} from './BaseAPI.js'

const search = async (search, page) => {
  const url = `/eTenancy/search`
  const payload = {
    search: search,
    paging: {
      page: page,
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
  const payload = {
    ...params,
  }
  try {
    const result = await baseAPI.post(url, payload, {responseType: 'arraybuffer'})
    return result.data
  } catch (err) {
    throw err
  }
}

const create = async (params) => {
  const url = `/eTenancy/create`
  console.log(url)
  const payload = {
    ...params,
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

const edit = async (params) => {
  const url = `/eTenancy/edit`
  console.log(url)
  const payload = {
    ...params,
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

const getById = async (eTenancyId) => {
  const url = `/eTenancy/getById`
  const payload = {
    _id: eTenancyId,
  }
  try {
    const result = await baseAPI.post(url, payload)
    return result.data
  } catch (err) {
    throw err
  }
}

const signAgreement = async (eTenancyId, hostName, hostSignature) => {
  const url = `/eTenancy/signAgreement`
  const payload = {
    _id: eTenancyId,
    hostName: hostName,
    hostSignature: hostSignature,
  }
  console.log(payload)
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
  edit: edit,
  getById: getById,
  signAgreement: signAgreement,
}
