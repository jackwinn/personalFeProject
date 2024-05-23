import { userAPI } from "../api/userAPI";


const search = async (params) => {
  console.log(params)
    return await userAPI.login(params)
  }

export const etenancyBiz = {
    search: search,
    // save: save,
    // update: update,
    // getById: getById
};
