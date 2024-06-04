import {eTenancyAPI} from '../api/etenancyAPI'

const search = async (search, page) => {
  return await eTenancyAPI.search(search, page)
}

const previewAgreement = async (params) => {
  return await eTenancyAPI.previewAgreement(params)
}

const create = async (params) => {
  return await eTenancyAPI.create(params)
}

const edit = async (params) => {
  return await eTenancyAPI.edit(params)
}

const getById = async (etenancyId) => {
  return await eTenancyAPI.getById(etenancyId)
}

const signAgreement = async (etenancyId, signatureImage) => {
  return await eTenancyAPI.signAgreement(etenancyId, signatureImage)
}

export const etenancyBiz = {
  search: search,
  previewAgreement: previewAgreement,
  create: create,
  edit: edit,
  getById: getById,
  signAgreement: signAgreement,
}
