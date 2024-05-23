import { userAPI } from "../api/userAPI";

const login = async (params) => {
  console.log(params)
    return await userAPI.login(params)
  }

export const userBiz = {
    login: login,
    // save: save,
    // update: update,
    // getById: getById
};
