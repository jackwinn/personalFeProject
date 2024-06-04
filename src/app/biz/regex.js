const isNumeric = (input) => {
    return (/^[0-9]*$/.test(input));
}

const isAlphabetWithSymbols = (input) => {
    return (/^[a-zA-Z' -]+$/.test(input))
};

const isName = (input) => {
    return (/^[a-zA-Z\s/@.]+$/).test(input);
}

const isMalaysianIC = (input) => {
    return (/^\d{6}(?:-\d{2}){0,1}-\d{4}$/.test(input) || /^[MP]\d{6}-\d{2}-\d{3}$/.test(input));
}

const isValidEmail = (email) => {
    const emailRegexp = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return emailRegexp.test(email);
};

const isValidPhone = (phone) => { //01x-xxxxxxx / 01x-xxxxxxxx format
    return /^(01)[0-46-9]\-[0-9]{7,8}$/g.test(phone)
}

export const regex = {
    isNumeric: isNumeric,
    isAlphabetWithSymbols: isAlphabetWithSymbols,
    isName: isName,
    isMalaysianIC: isMalaysianIC,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
}
