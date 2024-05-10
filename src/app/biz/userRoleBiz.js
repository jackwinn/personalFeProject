import apiUserRole from '../api/UserRoleAPI'

const search = async (params) => {
    try {
        const result = await apiUserRole.search(params)
        if (result) {
            return result
        } else return []

    } catch (err) {
        throw err
    }
}

const save = async (params) => {
    try {
        const result = await apiUserRole.save(params)
        return result

    } catch (err) {
        throw err
    }
}

const update = async (params) => {
    try {
        const result = await apiUserRole.update(params)
        return result

    } catch (err) {
        throw err
    }
}

const getById = async (params) => {
    try {
        const result = await apiUserRole.getById(params)
        return result

    } catch (err) {
        throw err
    }
}

export default {
    search: search,
    save: save,
    update: update,
    getById: getById
}