import { eTenancyAPI } from "../api/etenancyAPI";


const search = async (search, page) => {
  return await eTenancyAPI.search(search, page)
}

const previewAgreement = async (params) => {
  console.log(params)
  return await eTenancyAPI.previewAgreement(params)
}

const create = async (params) => {
  console.log(params)
  return await eTenancyAPI.create(params)
}

const update = async (params) => {
  console.log(params)
  return await eTenancyAPI.update(params)
}

const getById = async (etenancyId) => { 
  return await eTenancyAPI.getById(etenancyId)
}

export const etenancyBiz = {
  search: search,
  previewAgreement: previewAgreement,
  create: create,
  update: update,
  getById: getById
};
