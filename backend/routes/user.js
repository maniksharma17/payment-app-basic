const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET_KEY = require("../config")
const router = express.Router()
const { User, Account } = require("../database/db")
const { authMiddleware } = require("../middleware/middleware")
const { signupSchema, signinSchema, updateSchema } = require("../auth/userSchema")

// signup route
router.post("/signup", async (req, res)=>{
    const userData = req.body
    const parsedUserData = signupSchema.safeParse(userData)

    if (parsedUserData.success){
        const existingUser = await User.findOne({username: userData.username})
    
        if (existingUser){
            res.status(411).json({message: "Username already exixts."})
        } else{
            User.create({
                username: userData.username,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName
            }).then((user)=>{
                const userID = user._id
                const token = jwt.sign({userID}, JWT_SECRET_KEY)

                Account.create({
                    userId: user._id,
                    balance: Math.floor(Math.random() * 10000)
                })



                res.status(200).json({
                    message: "User created successfully",
                    token: token})
                })

           
        }
    }
    else {
        res.json(parsedUserData.error.issues[0].message)
    }
})

// signin route
router.post("/signin", async (req, res)=>{
    const userData = req.body
    
    if (!(signinSchema.safeParse(userData).success)){
        res.status(411).json({
            message: "Invalid Data"
        })
    }

    const existingUser = await User.findOne({username: userData.username, password: userData.password})

    if (existingUser){
        const token = jwt.sign({userID: existingUser._id}, JWT_SECRET_KEY)
        res.status(200).json({
            token: token
        })
    } else{
        res.status(411).json({
            message: "User does not exists."
        })
    }
})

// update route
router.put("/", authMiddleware, (req, res)=>{
    const userID = req.userID
    const userData = req.body

    const parsedUserData = updateSchema.safeParse(userData)
    if (!(parsedUserData.success)){
        res.json({message: parsedUserData.error.issues[0].message})
    }

    User.updateOne({_id: userID}, {
        $set:{
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName
        }
    }).then(()=>{
        res.json({message: "Updated successfully."})
    }).catch((e)=>{
        res.json({message: "Error while updating."})
    })
})

// all users route
router.get("/bulk", authMiddleware, (req, res)=>{
    const filter = req.query.filter || "";

    User.find({
        $or: [
            {firstName: {
                "$regex": filter
            }},
            {lastName: {
                "$regex": filter}}
        ]})
        .then((users)=>{
        
            res.json({
                users: users.map(user => ({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    _id: user._id
                }))
            }) 
    })

})


module.exports = router