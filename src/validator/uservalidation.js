const mongoose = require("mongoose");
const { isValidRequestBody, isValidObjectId, isValidData } = require("../validator/validation")
// const validate = require("../validator/validation")




const verifyPassword = function (password) {

    //minimum password length validation  
    if (password.length < 8) {

        msg = "Password length must be atleast 8 characters"
        return msg;
    }

    //maximum length of password validation  
    if (password.length > 15) {

        msg = "Password length must not exceed 15 characters"
        return msg;
    }


    return true;

}

const verifyEmail = function (email) {
    if (!/^[a-z0-9]{1,}@g(oogle)?mail\.com$/.test(email)) return false;
    return true;
}


const checkCreate = function (req, res, next) {
    try {

        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Request body is empty!! Please provide the user details" })
        }

        const { title, name, phone, email, password } = requestBody;

        //check if each mandatory field is present in request body
        let missdata = "";

        if (!isValidData(title)) {
            missdata = missdata + "title"

        }
        if (!isValidData(name)) {
            missdata = missdata + " " + "name"

        }
        if (!isValidData(phone)) {
            missdata = missdata + " " + "phone"

        }
        if (!isValidData(email)) {
            missdata = missdata + " " + "email"

        }
        if (!isValidData(password)) {
            missdata = missdata + " " + "password"

        }

        if (missdata) {
            let message = missdata + " is missing  or not String type"
            return res.status(400).send({ status: false, msg: message })
        }

        //validating other constraints
        if (!(['Mr', "Mrs", "Miss"].includes(title))) {
            return res.status(400).send({ status: false, msg: "title not valid : it should be Mr ,Mrs, Miss" })
        }

        if (!name.match(/^[A-Z,a-z, ,]+$/)) {
            return res.status(400).send({ status: false, msg: " Name should be in valid format" })
        }

        if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
            return res.status(400).send({ status: false, msg: "Mobile number should be in valid format" })
        }
        if (!verifyEmail(email)) {
            return res.status(400).send({ status: false, msg: "Email format is invalid" })

        }


        const result = verifyPassword(password)
        if (result != true) {
            return res.status(400).send({ status: false, message: result })
        }

        //if all validations are correct then go to controller
        next()

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}

const checkLogin = function (req, res, next) {
    try {

        const requestBody = req.body
            

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Request body is empty!! Please provide the email and password" })
        }


       


    const { email, password } = requestBody


    if (!isValidData(email)) {
        return res.status(400).send({ status: false, msg: "Please provide email" })

    }


    if (!isValidData(password)) {
        return res.status(400).send({ status: false, msg: "Please provide password" })

    }

    if (!verifyEmail(email)) {
        return res.status(400).send({ status: false, msg: "Email format is invalid" })

    }


    const result = verifyPassword(password)
    if (result != true) {
        return res.status(400).send({ status: false, message: result })
    }

    //if all validations are correct then go to controller
    next()

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}

module.exports = { checkCreate, checkLogin }