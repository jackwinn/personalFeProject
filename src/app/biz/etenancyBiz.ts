import { Props } from "../../_metronic/partials";
import { userAPI } from "../api/userAPI";
// import { LoginParams } from '../interfaces/modules/userModule.interface'

const search = async (params: any) => {
  console.log(params)
    return await userAPI.login(params)
  }

export const etenancyBiz = {
    search: search,
    // save: save,
    // update: update,
    // getById: getById
};
