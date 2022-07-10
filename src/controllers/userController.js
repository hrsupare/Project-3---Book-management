const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const validate = require("../validator/validation")

//<<------------------------------------------- CREATE USER ---------------------------------------------------->>
const createUser = async function (req, res) {
    try {
        requestBody = req.body;
        requestBody.name = requestBody.name.trim().split(" ").filter(word => word).join(" ");
        //<----create a user document---->
        const savedData = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: 'Success', data: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//<<-------------------------------------------  LOGIN ---------------------------------------------------->>
const userLogin = async function (req, res) {
    try {
        const { email, password } = req.body

        //check if user is valid 
        const getData = await userModel.findOne({ email: email, password: password })
        if (!getData) {
            return res.status(401).send({ status: false, msg: "Incorrect email or password" })
        }

        //<<-------generating token --------->>
        const token = jwt.sign({ userId: getData._id }, "##k&&k@@s")
        res.status(200).send({ status: true, data: token })

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}

module.exports = { createUser, userLogin }