const mongoose = require("mongoose")
const {accommodation} = require("./accommodation")

const content = [
    {
      "title": "Cozy Studio Apartment",
      "description": "A charming studio apartment with modern amenities.",
      "price": "$800/month",
      "location": "Downtown City"
    },
    {
      "title": "Spacious Student House",
      "description": "A large house perfect for students, fully furnished.",
      "price": "$1200/month",
      "location": "University District"
    },
    {
      "title": "Luxury Condo with a View",
      "description": "A high-end condominium with panoramic city views.",
      "price": "$2000/month",
      "location": "Skyline Heights"
    },
    {
      "title": "Quaint Cottage by the Lake",
      "description": "A charming cottage near a serene lake, ideal for nature lovers.",
      "price": "$900/month",
      "location": "Lakefront Community"
    },
    {
      "title": "Modern Loft in Arts District",
      "description": "A stylish loft in the heart of the arts and culture scene.",
      "price": "$1500/month",
      "location": "Arts District"
    }
  ]

const new_content = {image: "https://source.unsplash.com/random/?apartment", price: Math.floor(Math.random()*1000) }

async function populateDB(content){
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/stellicasa")
        console.log("DATABSE Connected")
    } catch (error) {
        console.log("error")
    }
    
    await accommodation.insertMany(content)
    
}


async function updateDB(){
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/stellicasa")
        console.log("DATABSE Connected")
    } catch (error) {
        console.log("error")
    }
    for (let i = 0; i < 5; i++){
        await accommodation.updateMany({}, {image: "https://source.unsplash.com/random/?apartment", price: Math.floor(Math.random()*1000) })
    }
    
}
// updateDB()