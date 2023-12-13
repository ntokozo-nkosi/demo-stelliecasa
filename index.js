const path = require("path")
const methodOverride = require("method-override") // For overriding hhtp methods
const Joi = require('joi'); // For server side form validation
const AppError = require("./AppError") // For custom errors
const ejsMate = require("ejs-mate") // FOr creating a boilerplate
const mongoose = require("mongoose") // MongoDB ODM
const { accommodation } = require("./models/accommodation") // DB Model/Collection
const { Review } = require("./models/review")
const express = require("express")
const { execPath } = require("process")
const app = express()

const {validateForm} = require("./models/formSchema")

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))

async function connectToDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/stellicasa")
        console.log("DATABSE Connected")
    } catch (error) {
        console.log("Databbase error!!!")
    }
}

connectToDB()

const db = mongoose.connection

// const wrapAsync = (fn) => {
//     return function(req,res,next){
//         fn(res,req,next).catch(e => next(e))
//     }
// }

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

//// Index
app.get("/", (req,res) => {
    res.render("home")
})

//// Create
app.get("/accommodations/new", (req,res) => {
    res.render("accommodations/new")
})

app.post("/accommodations", validateForm, async (req,res, next) => {
    try {
        const place = req.body
        await accommodation.insertMany([place])
        res.redirect("/accommodations")
    } catch (e) {
        next(e)
    }
    
})

app.post("/reviews/:currentPlaceId",async (req,res, next) => {
    try {
        // Validate Schema using JOI
        const schema = Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            body: Joi.string().min(4).max(1000).required()
        }).required()

        const { error, value } = schema.validate(req.body)

        if (error) {
            throw new AppError(500, error.message)
        }

        // Save review to the database 
        let newReview = new Review(req.body)
        newReview.save()

        // // Associate review with an accommodation
        await accommodation.findByIdAndUpdate(req.params.currentPlaceId, {$push: {reviews: newReview}})
        let place = await accommodation.findById(req.params.currentPlaceId).populate("reviews")
        console.log(place)

    } catch (e){
        next(e)
    }

    res.redirect(`/accommodations/${req.params.currentPlaceId}`)
})

//// Read 
app.get("/accommodations", async (req,res, next) => {
    try {
        const places = await accommodation.find({})
        res.render("accommodations/all", { places })
    } catch (e) {
        next(e)
    }
    
})

app.get("/accommodations/:id", async (req,res, next) => {
    try {
        const place = await accommodation.findById(req.params.id).populate("reviews")
        if (!place) {
            throw new AppError(404, "Error: Place Not Found")
        }

        res.render("accommodations/show", { place })
    } catch (e) {
        next(e)
    }
})

//// Update
app.get("/accommodations/:id/edit", async (req,res) => {
    const place = await accommodation.findById(req.params.id)
    res.render("accommodations/edit", {place} )
})

app.patch("/accommodations/:id", validateForm, async (req,res, next) => {
    try{
        const newInformation = req.body
        await accommodation.findByIdAndUpdate(req.params.id, newInformation)
        res.redirect("/accommodations")
    } catch (e) {
        next(e)
    }
    
})

//// Delete
app.delete("/accommodations/:id", async (req,res,next) => {
    try {
        await accommodation.findByIdAndDelete(req.params.id)
        res.redirect("/accommodations")
    } catch (e) {
        next(e)
    }
})

app.delete("/reviews/:currentPlaceId/:reviewId", async (req,res, next) => {
    try {
        const { currentPlaceId, reviewId } = req.params
        await accommodation.findByIdAndUpdate(currentPlaceId, {$pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId)
        res.redirect(`/accommodations/${currentPlaceId}`)
    } catch (e) {
        next(e)
    }
})

//// 404
app.all("*", (req,res, next) => {
    next(new AppError(404, "Page Not Found"))
}) 


app.use((err, req, res, next) => {
    const statusCode = err.status || 501 
    const errMessage = err.message || "Error: something went wrong" 
    res.status(statusCode).render("error",{errMessage, err}) 
}) 

// 
// app.use((req, res) => {
//     res.status(404).send("Not Found")
// })

app.listen(3020, () => {
    console.log("Server running")
})