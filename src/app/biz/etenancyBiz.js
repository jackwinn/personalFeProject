import { eTenancyAPI } from "../api/etenancyAPI";


const search = async (search, paging) => {
  return await eTenancyAPI.search(search, paging)
}

// const previewAgreement = async (params) => {
//   console.log(params)
//   return await eTenancyAPI.previewAgreement(params)
// }

export const etenancyBiz = {
  search: search,
  // previewAgreement: previewAgreement,
  // save: save,
  // update: update,
  // getById: getById
};
