import moment from "moment";

const log = (val) => {
    if (process.env.REACT_APP_DEV_MODE === `true`)
        console.log(val);
};

const formatDateYYYYMMDD = (date) => {
    return date?.toISOString().split('T')[0] // 2024-03-07
}

const formatDateDMY = (date) => {
    let formatDate = moment(date).format("DD-MM-YYYY");
    return formatDate;
};

const formatDateDMYAM = (date) => {
    const formattedTime = moment(date).format('DD-MM-YYYY h:mmA');
    return formattedTime;
}

const formatFullAddress = (...components) => {
    // Helper function to remove trailing commas from a string
    const removeTrailingCommas = (str) => str.replace(/,\s*$/, '');

    // Use array destructuring and map to format each component in a single line
    const [
        formattedLine1,
        formattedLine2,
        formattedPostcode,
        formattedCity,
        formattedArea,
        formattedState,
        formattedCountry
    ] = components.map(removeTrailingCommas);

    // Filter out falsy values and join the non-empty components with commas
    const formattedAddress = [formattedLine1, formattedLine2, formattedPostcode, formattedCity, formattedArea, formattedState, formattedCountry]
        .filter(Boolean)
        .join(', ');

    return formattedAddress;
};

const numberFormatter = (val, decimal, isPercentage) => {
    val = String(val)
    let newVal = "";

    const thousandSeparator = (val) => {
        if (isPercentage) return val //no thousand separator for percentage %
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (decimal > 0) {
        newVal = val.replace(/[^0-9.]/g, ""); //allow decimal

        if (val.indexOf(".") === 0) { //auto add a zero if dot is typed first
            newVal = val.replace(/\./g, "0.")
            console.log(val)
        }
        if (newVal.charAt(0) === "0" && newVal.charAt(1) !== ".") {
            return newVal = "0" //prevent typing number start with zero except decimal
        }

        const dotIdx = newVal.indexOf(".")

        if (dotIdx >= 0) {
            newVal = (thousandSeparator(newVal.substring(0, dotIdx)) //numbers before dot
                + newVal.substring(dotIdx, dotIdx + 1) //dot
                + newVal.substring(dotIdx + 1, dotIdx + 1 + decimal).replace(/\./g, "")) //decimal numbers after dot (prevent typing multiple dots)
        }
        else newVal = thousandSeparator(newVal)
        // newVal = (dotIdx >= 0) ?
        //     (thousandSeparator(newVal.substring(0, dotIdx)) + newVal.substring(dotIdx, dotIdx + 1)
        //         + newVal.substring(dotIdx + 1, dotIdx + 1 + decimal).replace(/\./g, ""))
        //     : thousandSeparator(newVal)
    }
    else {
        newVal = thousandSeparator(val.replace(/[^0-9]/g, "")) //no decimal allowed
    }

    return newVal
}

const formatCurrency = (val) => {
    return val?.toFixed(2)
}

export default {
    log: log,
    formatDateYYYYMMDD: formatDateYYYYMMDD,
    formatDateDMY: formatDateDMY,
    formatDateDMYAM: formatDateDMYAM,
    formatFullAddress: formatFullAddress,
    numberFormatter: numberFormatter,
    formatCurrency: formatCurrency,
}