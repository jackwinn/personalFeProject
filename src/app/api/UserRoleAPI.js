import apibase from './BaseAPI'

const search = async (params) => {
    try{
        const res = await apibase.post('/userRoles/search', params)
        return res.data

    } catch (err){
        throw err
    }
}

const save = async (params) => {
    try{
        const res = await apibase.post('/userRoles/save', params)
        return res.data

    } catch (err){
        throw err
    }
}

const update = async (params) => {
    try{
        const res = await apibase.post('/userRoles/update', params)
        return res.data

    } catch (err){
        throw err
    }
}

const getById = async (params) => {
    try{
        const res = await apibase.post('/userRoles/getById', params)
        return res.data

    } catch (err){
        throw err
    }
}

export default {
    search: search,
    save: save,
    update: update,
    getById: getById
}