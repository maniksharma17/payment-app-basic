// importing packages
const express = require("express");
const cors = require("cors")
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// routing
const rootRouter = require("./routes/index")
app.use("/api/v1", rootRouter)


// listening on PORT
app.listen(3000, ()=>{
    console.log("Listening on PORT 3000")
})