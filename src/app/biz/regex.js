
// accept numbers only 
const isNumeric = (input) => {
    return (/^[0-9]*$/.test(input));
}

const isDecimal = (input) => {
    return (/^(?:\d+\.\d{2}|\d+\.\d{1}|\d+|\d*\.\d{1}|\d*\.\d{2})$/.test(input));
};

// allow numbers and - only
const isNumberWithDash = (input) => {
    return /^[0-9-]+$/.test(input);
};

const isAlphabet = (input) => {
    return (/^[a-zA-Z]*$/.test(input));
};

const isAlphabetWithSpace = (input) => {
    return (/^[a-zA-Z ]+$/.test(input));
};

// accept alphabet, hyphens, spaces, and apostrophes (suitable for area, state and country)
const isAlphabetWithSymbols = (input) => {
    return (/^[a-zA-Z' -]+$/.test(input))
};

const isValidEmail = (email) => {
    const emailRegexp = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return emailRegexp.test(email);
};

const isValidPhone = (phone) => { //01x-xxxxxxx / 01x-xxxxxxxx format by marketing
    return /^(01)[0-46-9]\-[0-9]{7,8}$/g.test(phone)
}

const isCompleteAddress = (address) => {
    if ((!address.line1) || (address.city === 'City') || (address.state === 'State') || (!address.postcode) || (address.country === 'Country'))
        return false;
    else return true;
};

// allow symbol: / @ .
const isName = (input) => {
    return (/^[a-zA-Z\s/@.]+$/).test(input);
}

const isMalaysianIC = (input) => {
    return (/^\d{6}(?:-\d{2}){0,1}-\d{4}$/.test(input) || /^[MP]\d{6}-\d{2}-\d{3}$/.test(input));
}


export default {
    isNumeric: isNumeric,
    iseDecimal: isDecimal,
    isNumberWithDash: isNumberWithDash,
    isAlphabet: isAlphabet,
    isAlphabetWithSpace: isAlphabetWithSpace,
    isAlphabetWithSymbols: isAlphabetWithSymbols,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isCompleteAddress: isCompleteAddress,
    isName: isName,
    isMalaysianIC: isMalaysianIC
};