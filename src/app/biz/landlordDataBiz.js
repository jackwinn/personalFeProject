import apiLandlordData from "../api/LandlordDataAPI"

const getById = async (params) => {
    try {
        const result = await apiLandlordData.getById(params)
        return result

    } catch (err) {
        throw err
    }
}

const search = async (params) => {
    try {
        const result = await apiLandlordData.search(params)
        if (result) {
            return result
        } else return []

    } catch (err) {
        throw err
    }
}

const save = async (params) => {
    try {
        const result = await apiLandlordData.save(params)
        return result

    } catch (err) {
        throw err
    }
}

const update = async (params) => {
    try {
        const result = await apiLandlordData.update(params)
        return result

    } catch (err) {
        throw err
    }
}

const generateResetPasswordLink = async (params) => {
    try {
        const result = await apiLandlordData.generateResetPasswordLink(params)
        return result
    } catch (err) {
        throw err
    }
}

const validateOtp = async (params) => {
    // console.log(params)
    try {
        const result = await apiLandlordData.validateOtp(params)
        return result

    } catch (err) {
        throw err
    }
}

const sendSms = async (params) => {
    // console.log(params)
    try {
        const result = await apiLandlordData.sendSms(params)
        return result

    } catch (err) {
        throw err
    }
}

export default {
    getById: getById,
    search: search,
    save: save,
    update: update,
    validateOtp: validateOtp,
    generateResetPasswordLink: generateResetPasswordLink,
    sendSms: sendSms,
}