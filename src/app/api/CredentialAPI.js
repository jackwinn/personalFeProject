import apibase from './BaseAPI';

const hashKey = async (hashKey) => {
    const url = `/credential/verify/${hashKey}`;
    try {
        const result = await apibase.get(url);
        return result.data;
    } catch (err) {
        throw err;
    }
};

const save = async (payload) => {
    // console.log(payload)
    const url = `/credential/save`;
    try {
        const result = await apibase.post(url, payload);
        console.log(result)
        return result.data
    } catch (err) {
        throw err;
    }
};

export default {
    hashKey: hashKey,
    save: save,
}