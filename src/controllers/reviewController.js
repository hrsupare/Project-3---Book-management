const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/booksModel")
const { isValidRequestBody, isValidData, isValidObjectId } = require("../validator/validation")


// <===================================== POST  books/:bookId/review =====================================>
const createReview = async function (req, res) {
    try {
        let book = req.params
        req.body.bookId = book.bookId
        let requestBody = req.body

        let bookCheck = await bookModel.findById({ _id: book.bookId, isDeleted: false })
        if (!bookCheck)
            return res.status(404).send({ status: false, message: "book not found" })
        let bookDetails = await bookModel.findByIdAndUpdate({ _id: book.bookId }, { $inc: { reviews: 1 } })
        console.log(bookDetails)
        let createReview = await reviewModel.create(requestBody)
        res.status(201).send({ status: true, message: "Sucess", data: createReview })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


// <==================================== UPDATE /books/:bookId/review/:reviewId =====================================>
const updateReview = async function (req, res) {

    try {
        let data = req.body
        let { bookId, reviewId } = req.params
        var details = {}
        console.log(details)

        //validating empty body
        if (!isValidRequestBody(data))
            return res.status(400).send({ status: false, msg: "Body cannot be empty" })

        //validating bookId
        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, msg: `bookId ${id.bookId} is Invalid BookId` })


        let reqBook = await bookModel.findById(bookId).select({ ISBN: 0, __v: 0 });

        if (!reqBook)
            return res.status(404).send({ status: false, msg: "No such Book Exists" })
        if (reqBook.isDeleted == true)
            return res.status(404).send({ status: false, msg: "This Book is currently not available, " })

        //validating reviewId
        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, msg: `reviewId ${reviewId} is Invalid ReviewId` })

        let reqReview = await reviewModel.findById(reviewId);
        //let reqReview = await reviewModel.findOne({_id: reviewId, bookId: bookId);

        if (!reqReview)
            return res.status(404).send({ status: false, msg: "No review with this id Exists" })

        if (reqReview.isDeleted == true)
            return res.status(404).send({ status: false, msg: "This Review is not found : already deleted" })


        //check if the review is of the specified book    
        let relReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId });

        if (!relReview)
            return res.status(404).send({ status: false, msg: "Both review and book exist, but it's not the review of specified book" })


        //Since both id's are valid , now validate contents and update review 
        const { review, rating, reviewedBy } = data;

        //<========Validating the contents to update=========>

        //validate review 
        if (review) {
            if (!isValidData(review))
                return res.status(400).send({ status: false, msg: `${review} is not a valid review` })

            details.review = review.trim();
        }

        //validating rating
        if (rating) {
            if (!rating || typeof rating != "number" || rating < 1 || rating > 5) {
                return res.status(400).send({ status: false, msg: `${rating} is not a valid rating: provide a valid rating (1-5)` })
            }

            details.rating = rating;
        }

        //validating Reviewer's name
        if (reviewedBy) {
            if (!isValidData(reviewedBy) || !(/^[a-zA-Z ]{2,30}$/.test(reviewedBy)))
                return res.status(400).send({ status: false, msg: `${reviewedBy} is not a valid Reviewer's Name` })

            details.reviewedBy = reviewedBy.trim();
        }


        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, details, { new: true }).select({ __v: 0 })
        console.log(updatedReview)

        // if(updatedReview. )
        //     error message for update operation failed

        const reviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 });
        reqBook._doc.reviewsData = reviews
        res.status(200).send({ status: true, message: 'Success', data: reqBook })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


// <=====================================DELETE /books/:bookId/review/:reviewId =====================================>
const deleteReview = async function (req, res) {
    try {

        let { bookId, reviewId } = req.params

        // if (!isValidObjectId(bookId))
        //     return res.status(400).send({ status: false, msg: `bookId ${id.bookId} is Invalid BookId` })

        let reqBook = await bookModel.findOne({ _id: bookId });

        console.log(reqBook)

        if (!reqBook)
            return res.status(404).send({ status: false, msg: "No such Book Exists" })

        if (reqBook.isDeleted === true)
            return res.status(404).send({ status: false, msg: "This Book is currently not available " })

        //validating reviewId
        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, msg: `reviewId ${reviewId} is Invalid ReviewId` })

        let reqReview = await reviewModel.findById(reviewId);
        //let reqReview = await reviewModel.findOne({_id: reviewId, bookId: bookId);

        if (!reqReview)
            return res.status(404).send({ status: false, msg: "No review with this id Exists" })

        if (reqReview.isDeleted == true)
            return res.status(404).send({ status: false, msg: "This Review is not found : already deleted" })

        let delReview = await reviewModel.findByIdAndUpdate({ _id: reviewId, bookId: bookId }, { $set: { isDeleted: true } }, { new: true })


        let bookData = await bookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true })
        console.log(bookData)

        res.status(200).send({ status: false, message: "Review is deleted!!!!" })
    }
    catch (error) { res.status(500).send({ status: false, message: error.message }) }

}


module.exports = { createReview, updateReview, deleteReview }