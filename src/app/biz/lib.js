import moment from "moment";


const formatDateDDMMYYYY = (date) => {
    let formatDate = moment(date).format("DD-MM-YYYY");
    return formatDate;
};


export const lib = {
    formatDateDDMMYYYY: formatDateDDMMYYYY,
    // search: search,
    // save: save,
    // update: update,
    // getById: getById
};
