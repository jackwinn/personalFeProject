import { userAPI } from "../api/userAPI";
import { LoginParams } from '../interfaces/modules/userModule.interface'

const login = async (params: LoginParams) => {
  console.log(params)
    return await userAPI.login(params)
  }

export const userBiz = {
    login: login,
    // save: save,
    // update: update,
    // getById: getById
};
