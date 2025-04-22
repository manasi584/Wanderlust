const mongoose=require("mongoose")
const {data}=require("./data")
const Listing=require("../models/listing")


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

async function main(){
    await mongoose.connect(MONGO_URL)
}


main().then(()=>console.log("Connected to db"))
.catch((err)=>console.log(err));


async function initDb(){
await Listing.deleteMany({});
const updatedData=data.map((obj)=>({...obj,owner:"67fcebad44cbcfdf6a99d601"}));
await Listing.insertMany(updatedData);
console.log("Data was initialised");
return;
}


initDb();
