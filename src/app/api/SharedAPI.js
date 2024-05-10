import apibase from './BaseAPI';

const isEmailUnique = async (params) => {
    try {
        const res = await apibase.post('/share/isEmailUnique', params)
        return res.data

    } catch (err) {
        throw err
    }
}

const getCurrentVersion= async (params) => {
    try {
        const res = await apibase.post('/share/getCurrentVersion', params)
        return res.data

    } catch (err) {
        throw err
    }
}

const isMobileUnique = async (params) => {
    try {
        const res = await apibase.post('/share/isMobileUnique', params)
        return res.data

    } catch (err) {
        throw err
    }

}


export default {
    isEmailUnique: isEmailUnique,
    getCurrentVersion:getCurrentVersion,
    isMobileUnique: isMobileUnique
}