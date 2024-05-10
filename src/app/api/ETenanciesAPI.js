import apibase from './BaseAPI';
import lib from '../biz/lib';

const quickSearchActiveTenant = async (params) => {
    // lib.log(params)
    try {
        const res = await apibase.post('/eTenancies/quickSearchActiveTenant', params)
        return res.data

    } catch (err) {
        throw err
    }
}

const previewAgreement = async (params) => {
    // lib.log(params)
    try {
        const res = await apibase.post('/eTenancies/previewAgreement', params, { responseType: 'arraybuffer' })
        // const mimeType = res.headers['content-type'];
        // lib.log(mimeType)
        return res.data

    } catch (err) {
        throw err
    }
}

const previewReservationForm = async (params) => {
    // lib.log("previewReservationForm")
    // lib.log(params)
    try {
        const res = await apibase.post('/eTenancies/previewReservationForm', params, { responseType: 'arraybuffer' })
        // lib.log(res.data)
        return res.data

    } catch (err) {
        throw err
    }
}

const save = async (params) => {
    // lib.log("E-Tenancies save API params:")
    // lib.log(params)
    try {
        const res = await apibase.post('/eTenancies/save', params)
        return res.data

    } catch (err) {
        throw err
    }
}

const update = async (params) => {
    // lib.log("E-Tenancies save API params:")
    // lib.log(params)
    try {
        const res = await apibase.post('/eTenancies/update', params)
        return res.data

    } catch (err) {
        throw err
    }
}

const newId = async () => {
    try {
        const res = await apibase.post('/eTenancies/newId', {})
        return res.data

    } catch (err) {
        throw err
    }
}

const search = async (params) => {
    // lib.log("E-Tenancies search API params:")
    // lib.log(params)
    try {
        const res = await apibase.post('/eTenancies/search', params)
        return res.data
    } catch (err) {
        throw err
    }
}

const getById = async (id) => {
    // lib.log("Get by ID called")
    // lib.log(id)
    const params = {
        _id: id
    }
    try {
        const res = await apibase.post('/eTenancies/getById', params)
        return res.data;
    } catch (err) {
        throw err
    }
}

const getSignedRecord = async (id) => {
    // lib.log("Get by ID called")
    // lib.log(id)
    const params = {
        _id: id
    }
    try {
        const res = await apibase.post('/eTenancies/getSignedRecord', params)
        return res.data;
    } catch (err) {
        throw err
    }
}

const signAgreement = async (params) => {
    try {
        const res = await apibase.post('/eTenancies/signAgreement', params)
        return res.data;
    } catch (err) {
        throw err
    }
}

const generateSignatureLink = async (params) => {
    try {
        const res = await apibase.post('/eTenancies/generateSignatureLink', params)
        return res.data;
    } catch (err) {
        throw err
    }
}

const validateSecretKey = async (params) => {
    try {
        const res = await apibase.post('/eTenancies/validateSecretKey', params)
        return res.data;
    } catch (err) {
        throw err
    }
}

export default {
    quickSearchActiveTenant: quickSearchActiveTenant,
    previewAgreement: previewAgreement,
    previewReservationForm: previewReservationForm,
    save: save,
    update: update,
    newId: newId,
    search: search,
    getById: getById,
    getSignedRecord: getSignedRecord,
    signAgreement: signAgreement,
    generateSignatureLink: generateSignatureLink,
    validateSecretKey: validateSecretKey,
}