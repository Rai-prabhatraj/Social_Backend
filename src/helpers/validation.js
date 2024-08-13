exports.validation = (required_fields, data) => {
    const error = {}

    for (let i of required_fields) {
        if (!data[i]) {
            error[i] = `${i} is required`
            // error.push(`${i} is required`)
        }
    }

    return error;
}


exports.validEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return regex.test(email)
}