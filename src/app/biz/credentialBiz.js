import apiCredential from '../api/CredentialAPI';

const hashKey = async (hashKey) => {
    const result = await apiCredential.hashKey(hashKey);
    return result;
};

const save = async (payload) => {
    const result = await apiCredential.save(payload);
    return result;
}

export default {
    hashKey: hashKey,
    save: save,
}