import {eTenancyAPI} from '../api/etenancyAPI'

const search = async (search, page) => {
  return await eTenancyAPI.search(search, page)
}

const previewAgreement = async (params) => {
  console.log(params)
  return await eTenancyAPI.previewAgreement(params)
}

const create = async (params) => {
  console.log('create biz')
  console.log(params)
  return await eTenancyAPI.create(params)
}

const edit = async (params) => {
  console.log('edit biz')
  return await eTenancyAPI.edit(params)
}

const getById = async (etenancyId) => {
  return await eTenancyAPI.getById(etenancyId)
}

const signAgreement = async (etenancyId, hostName, signatureImage) => {
  return await eTenancyAPI.signAgreement(etenancyId, hostName, signatureImage)
}

export const etenancyBiz = {
  search: search,
  previewAgreement: previewAgreement,
  create: create,
  edit: edit,
  getById: getById,
  signAgreement: signAgreement,
}
