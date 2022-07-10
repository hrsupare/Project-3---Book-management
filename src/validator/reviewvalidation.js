const validate = require("./validation")



const ratingCheck = function (value) {

   num = /^[1-5]{1}$/

   if (!num.test(value)) return false

   return true
}


const reviewCheck = function (req, res, next) {

   let requestBody = req.body

   const bookId = req.params.bookId

   if (!isValidRequestBody(requestBody))

      return res.status(400).send({ status: false, message: "please give review and details" })


   const { reviewedBy, rating, review, reviewedAt, isDeleted } = requestBody

   // =========check wheather mandatory  fields are present or not=======================//

   let missdata = ""

   if (!bookId) { missdata = missdata + "bookId" }

   if (!rating) { missdata = missdata + " " + "rating" }

   if (!reviewedAt) { missdata = missdata + " " + "reviewedAt" }
   
   if (missdata) {let message = missdata + " " + "is missing"
      return res.status(400).send({ status: false, message: message })
   }
   // =================rating validation===============================//
   if (typeof rating != "number" || !ratingCheck(rating))

      return res.status(400).send({ status: false, message: "rating is not in a proper format" })

   //==================reviewat validation===========================//


   let dateCheck = new Date(reviewedAt).getTime()

   if (isNaN(dateCheck)) {

      return res.status(400).send({ status: false, message: "reviewAt is not in a proper format " })

   }
   // ===========================review validation=============================================//
   if (review) {

      if (!isValidData(review))

         return res.status(400).send({ status: false, message: "please give review properly" })

   }
   // ==============================reviewBy validation========================================//

   if (reviewedBy) {

      if (!isValidData(reviewedBy))

         return res.status(400).send({ status: false, message: "give proper name as reviewedBy" })

   }
   //============================bookId validation==========================================//
   if (!isValidObjectId(bookId)) {

      return res.status(400).send({ status: false, message: "not a valid bookId" })
   }

   if (isDeleted) {

      if (typeof isDeleted !== "boolean") {

         return res.status(400).send({ status: false, message: "isDeleted should be true or false" })
      }

   }


   next()
}

module.exports = { reviewCheck }