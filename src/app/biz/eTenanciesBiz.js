import apiETenancies from "../api/ETenanciesAPI"
import lib from "./lib"

const quickSearchActiveTenant = async (params) => {
    const result = await apiETenancies.quickSearchActiveTenant(params)
    return result
}

const previewAgreement = async (params) => {
    // lib.log(params)
    const result = await apiETenancies.previewAgreement(params)
    return result
}

const previewReservationForm = async (params) => {
    // lib.log(params)
    const result = await apiETenancies.previewReservationForm(params)
    return result
}

const save = async (params) => {
    // lib.log(params)
    const result = await apiETenancies.save(params)
    return result
}

const update = async (params) => {
    // lib.log(params)
    const result = await apiETenancies.update(params)
    return result
}

const newId = async () => {
    // lib.log(params)
    const result = await apiETenancies.newId()
    return result
}

const search = async (params) => {
    const result = await apiETenancies.search(params)
    return result
}

const getById = async (id) => {
    // lib.log(params)
    const result = await apiETenancies.getById(id)
    return result
}

const getSignedRecord = async (id) => {
    // lib.log(params)
    const result = await apiETenancies.getSignedRecord(id)
    return result
}

const signAgreement = async (params) => {
    // lib.log(params)
    const result = await apiETenancies.signAgreement(params)
    return result
}

const generateSignatureLink = async (params) => {
    // lib.log(params)
    const result = await apiETenancies.generateSignatureLink(params)
    return result
}

const validateSecretKey = async (params) => {
    // lib.log(params)
    const result = await apiETenancies.validateSecretKey(params)
    return result
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
    getSignedRecord:getSignedRecord,
    signAgreement: signAgreement,
    generateSignatureLink: generateSignatureLink,
    validateSecretKey: validateSecretKey,
}