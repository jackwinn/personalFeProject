import apiShared from "../api/SharedAPI"

const isEmailUnique = async (params) => {
    const result = await apiShared.isEmailUnique(params);
    return result;
}

const isMobileUnique = async (params) => {
    const result = await apiShared.isMobileUnique(params)
    return result
}

const getCurrentVersion = async (params) => {
    const result = await apiShared.getCurrentVersion(params);
    return result;
}

export default {
    isEmailUnique: isEmailUnique,
    isMobileUnique: isMobileUnique,
    getCurrentVersion: getCurrentVersion
}