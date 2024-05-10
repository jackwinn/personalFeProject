import imageCompression from 'browser-image-compression'

const dropzoneController = {
    accept: {
        'image/jpeg': [],
        'image/png': [],
        'application/pdf': []
    },
    maxSize: 4194304,
};

const compressImg = (canvas) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
    }

    return new Promise((resolve, reject) => {
        try {
            imageCompression(canvas, options).then((output) => {
                var reader = new FileReader();
                reader.readAsDataURL(output);
                reader.onloadend = () => {
                    resolve(reader.result);
                }
            })
        }
        catch (err) {
            reject(err);
        }
    });
};

export default {
    dropzoneController: dropzoneController,
    compressImg: compressImg,
}