//===============================express importing=============================================//
const express =require('express')
const router=express.Router()
//=================================user logic importing========================================//
const {checkCreate, checkLogin}=require('../validator/uservalidation')
const {createUser, userLogin} =require('../controllers/userController')
//==================================auth logic importing=====================================//
const {authentication, authorization}=require('../middlewares/auth')
//=================================book logic importing===================================//
const bookvalidation=require('../validator/bookvalidation')
const {createBook,getBookbyQuerry,bookDetail,updateBook,deleteBookbyPath}=require('../controllers/bookController')
//================================review logic importing==================================//
const {createReview} =require('../controllers/reviewController')
const{reviewCheck}=require("../validator/reviewvalidation")






//===========================routes for  users=====================================//
     //<---------------------create user-------------------->//
router.post('/register',checkCreate,createUser)
     //----------------------user login------------------>//
router.post('/login',checkLogin,userLogin)



//================================routes for books============================================================//
       //<-------------------book create------------------------->//
router.post('/books',authentication,authorization,bookvalidation,createBook)
       //<------------------get book-------------------------->//
router.get('/books',authentication,getBookbyQuerry)
       //<-----------------get book by bookId-------------->//
router.get('/books/:bookId',authentication,bookDetail)
       //<-----------------update book-------------------->//
router.put('/books/:bookId',authentication,authorization,updateBook)
       //<-----------------delete book------------------>//
router.delete('/books/:bookId',authentication,authorization,deleteBookbyPath)




// =============================routes for reviews================================================================//
        //<----------------review create------------------->//
router.post('/books/:bookId/review',reviewCheck,createReview)

// router.all("/**", function (req, res) {
//     res.status(404).send({
//         status: false,
//         msg: "The api you request is not available"
//     })
// })

module.exports = router;
