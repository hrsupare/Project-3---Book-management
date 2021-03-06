const bookModel = require("../models/booksModel");
const userModel = require("../models/userModel");
const { isValidRequestBody, isValidData, isValidObjectId, isString } = require("../validator/validation.js")
const validator = require('validator')
const moment = require('moment')



// <===================================== createBookValidation =====================================>

const bookvalidation = async function (req, res, next) {
    try {
        let data = req.body;
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        console.log( userId)

        //validating empty body
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "Body cannot be empty" })
        }
        //validating userId is entered and valid
        if (!isValidData(userId)) {
            return res.status(400).send({ status: false, msg: `Whats your userId` })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: `your provided userId is Invalid` })
        }
        let user_id = await userModel.findById({ _id: userId });
        if (!user_id) {
            return res.status(400).send({ status: false, msg: "No such User  exist" });
        }

        //<======Authorizing User=======>
        //check if the logged-in user is requesting to modify their own resources 
        if (userId != req.decodedtoken.userId)
            return res.status(403).send({ status: false, msg: 'Author loggedin is not allowed to modify the requested book data' })
        console.log("Successfully Authorized")



        //validating title is entered and valid
        if (!isValidData(title)) {
            return res.status(400).send({ status: false, msg: `Whats your Book Title` })
        }
        if (!isString(title) || !/^([a-zA-Z0-9 \' ]+)$/.test(title.trim())) {
            return res.status(400).send({ status: false, msg: `${title} is not a valid Book title it should alphabets or alphaNumeric` });
        }
        let checktitle = await bookModel.findOne({ title: title.trim().split(" ").filter(word => word).join(" ") })
        if (checktitle) { return res.status(400).send({ status: false, msg: "Book with this title is already" }) }

        //validating excerpt is entered and valid
        if (!isValidData(excerpt)) {
            return res.status(400).send({ status: false, msg: `Please add excerpt` })
        }
        if (!isString(excerpt) || !/^([a-zA-Z_',.()!\S ]+)$/.test(excerpt.trim())) {
            return res.status(400).send({ status: false, msg: "enter valid excerpt in alphabets only" });
        }


        //validating ISBN is entere and valid
        if (!ISBN) {
            return res.status(400).send({ status: false, msg: `Whats your Book ISBN No` })
        }
        if (!validator.isISBN(ISBN)) {
            return res.status(400).send({ status: false, msg: `${ISBN} is not a valid ISBN` })
        }

        let checkISBN = await bookModel.find({ ISBN: ISBN });
        if (checkISBN.length !== 0) {
            return res.status(400).send({ status: false, msg: "plz enter new ISBN" });
        }
        //Validating category is entered and valid

        if (!isValidData(category)) {
            return res.status(400).send({ status: false, msg: ` Please add category` })
        }
        if (!isString(category) || !/^([a-zA-Z \' ]+)$/.test(category.trim())) {
            return res.status(400).send({ status: false, msg: " enter valid category in alphabets only" });
        }

        //validating subCategory is entered and valid
        if (typeof subcategory === "undefined" || subcategory === null) {
            return res.status(400).send({ status: false, msg: `Please add Subcategory` })
        }
        if (subcategory.length == 0) {
            return res.status(400).send({ status: false, msg: "please add Subcategory" });
        }


        if (subcategory) {
            for (let i = 0; i < subcategory.length; i++) {
                if (subcategory[i] == 0) {
                    return res.status(400).send({ status: false, msg: "subcategory should have atleast one alpha" });
                }

                if (!/^([a-zA-Z ]+)$/.test(subcategory[i])) {
                    return res.status(400).send({ status: false, msg: " enter valid subcategory in alphabets only" });
                }
            }
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, msg: "releasedAt is not given" })
        }

        if (!releasedAt.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) {
            return res.status(400).send({ status: false, msg: "date format should be in YYYY-MM-DD" })
        }



        next()
    } catch (err) {
        res.status(500).send({ status: false, massage: "success", msg: err.message });
    }
}

module.exports = bookvalidation
