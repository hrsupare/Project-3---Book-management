const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const { isValidRequestBody, isValidData } = require("./validation")





const verifyPassword = function (password) {

    //minimum password length validation  
    if (password.length < 8) {

        message = "Password length must be atleast 8 characters"
        return message;
    }

    //maximum length of password validation  
    if (password.length > 15) {

        message = "Password length must not exceed 15 characters"
        return message;
    }


    return true;

}

const verifyEmail = function (email) {
    if (!/^[a-z0-9]{1,}@g(oogle)?mail\.com$/.test(email)) return false;
    return true;
}


const checkCreate = async function (req, res, next) {
    try {

        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "invalid request params!! please provide details" })
        }

        const { title, name, phone, email, password, address } = requestBody;

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
            let message = missdata + " is missing "
            return res.status(400).send({ status: false, message: message })
        }

        //validating other constraints
        if (typeof title !== "string") {
            return res.status(400).send("type of title should be string")
        }

        if (typeof name !== "string") {
            return res.status(400).send("type of name should be string")
        }

        if (typeof email !== "string") {
            return res.status(400).send("type of email should be string")
        }

        if (typeof password !== "string") {
            return res.status(400).send("type of password should be string")
        }

        if (typeof  phone !== "string") {
            return res.status(400).send("type of  number should be string")
        }





        if (!(["Mr", "Mrs", "Miss"].includes(title))) {
            return res.status(400).send({ status: false, message: "title not valid : it should be Mr ,Mrs, Miss" })
        }

        if (!name.match(/^[A-Z,a-z, ,]+$/)) {
            return res.status(400).send({ status: false, message: " Name should be in valid format" })
        }

        if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Mobile number should be in valid format" })
        }

        if (!verifyEmail(email.trim())) {
            return res.status(400).send({ status: false, message: "Email format is invalid" })

        }
        const result = verifyPassword(password.trim())
        if (result != true) {
            return res.status(400).send({ status: false, message: result })
        }
        if (address) {
            if (typeof address !== "object") {
                return res.status(400).send({ status: false, message: "address should be in object format" })
            }


            if (address.street) {
                if (typeof address.street !== "string") {
                    return res.status(400).send("type of street should be string")
                }

                if (!/^([a-zA-Z 0-9\S]+)$/.test(address.street))
                    return res.status(400).send({ status: false, message: "street is not in valid format and no special charaters allowed " })
            }
            if (address.city) {
                if (typeof address.city !== "string") {
                    return res.status(400).send("type of city should be string")
                }
                if (!/^([a-zA-Z]+)$/.test(address.city))
                    return res.status(400).send({ status: false, message: "city is not valid format " })
            }
            if (address.pincode) {
                if (typeof address.pincode !== "string") {
                    return res.status(400).send("type of pincode should be string")

                }

                if (!/^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(address.pincode))
                    return res.status(400).send({ status: false, message: "pincode should be in number and only 6 digits " })

            }
        }
        let checkphone = await userModel.find({ phone: phone });
        if (checkphone.length !== 0) {
            return res.status(400).send({ status: false, message: "phone is already registered" });
        }
        let checkemail = await userModel.find({ email: email });
        if (checkemail.length !== 0) {
            return res.status(400).send({ status: false, message: "email is already registered" });
        }
        //if all validations are correct then go to controller
        next()

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}

const checkLogin = async function (req, res, next) {
    try {

        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Request body is empty!! Please provide the email and password" })
        }


        const { email, password } = requestBody


        if (!isValidData(email)) {
            return res.status(400).send({ status: false, message: "Please provide email" })

        }
        if (typeof email !== "string") {
            return res.status(400).send("type of email should be string")
        }

        if (!isValidData(password)) {
            return res.status(400).send({ status: false, message: "Please provide password" })

        }
        if (typeof password !== "string") {
            return res.status(400).send("type of password should be string")
        }





        if (!verifyEmail(email)) {
            return res.status(400).send({ status: false, message: "Email format is invalid" })

        }
        let checkemail = await userModel.find({ email: email });

        if (checkemail.length === 0) {
            return res.status(404).send({ status: false, message: "email is not registered" });
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