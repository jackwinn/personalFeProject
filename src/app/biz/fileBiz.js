import apiFile from '../api/FileAPI';

const upload = (formData, folder) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fileLinks = await apiFile.upload(formData, folder);
            resolve(fileLinks);
        } catch (err) {
            reject(err);
        }
    })
};

export default {
    upload: upload,
};