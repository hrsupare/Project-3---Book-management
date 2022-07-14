const express = require('express')
const router = express.Router()
const bookvalidation = require('../validator/bookvalidation')
const { checkCreate, checkLogin } = require('../validator/uservalidation')
const { createBook, getBookbyQuerry, bookDetail, updateBook, deleteBookbyPath } = require('../controllers/bookController')
const { createUser, userLogin } = require('../controllers/userController')
const { authentication, authorization } = require('../middlewares/auth')
const { createReview, updateReview, deleteReview } = require('../controllers/reviewController')
const { reviewCheck } = require('../validator/reviewvalidation')
//< ==================================== User API ======================================================>

router.post('/register', checkCreate, createUser)

router.post('/login', checkLogin, userLogin)

//<===================================== Book API ======================================================>

router.post('/books', authentication, bookvalidation, createBook)

router.get('/books', authentication, getBookbyQuerry)

router.get('/books/:bookId', authentication, bookDetail)

router.put('/books/:bookId', authentication, updateBook)

router.delete('/books/:bookId', authentication, deleteBookbyPath)

// <=================================== Review API ====================================================>

router.post('/books/:bookId/review', reviewCheck, createReview)

router.put('/books/:bookId/review/:reviewId', updateReview)

router.delete('/books/:bookId/review/:reviewId', deleteReview)

// <=================================== ERROR  ====================================================>

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})

module.exports = router; 