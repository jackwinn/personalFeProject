import apibase from './BaseAPI';

const getById = async (params) => {
    try {
        const res = await apibase.post('/landlordData/getById', params)
        return res.data

    } catch (err) {
        throw err
    }
}

const save = async (params) => {
    try {
        const res = await apibase.post('/landlordData/save', params)
        return res.data

    } catch (err) {
        throw err
    }
}

const search = async (params) => {
    try {
        const res = await apibase.post('/landlordData/search', params)
        return res.data
    } catch (err) {
        throw err
    }
}

const update = async (params) => {
    try {
        const res = await apibase.post('/landlordData/update', params)
        return res.data
    } catch (err) {
        throw err
    }
}

const generateResetPasswordLink = async (params) => {
    try {
        const res = await apibase.post('/landlordData/generateResetPasswordLink', params)
        return res.data
    } catch (err) {
        throw err
    }
}

const validateOtp = async (params) => {
    try {
        const res = await apibase.post('/landlordData/validateOtp', params)
        return res.data
    } catch (err) {
        throw err
    }
}

const sendSms = async (params) => {
    try {
        const res = await apibase.post('/sms/send', params)
        return res.data
    } catch (err) {
        throw err
    }
}

export default {
    getById: getById,
    search: search,
    update: update,
    save: save,
    validateOtp: validateOtp,
    generateResetPasswordLink: generateResetPasswordLink,
    sendSms: sendSms,
}