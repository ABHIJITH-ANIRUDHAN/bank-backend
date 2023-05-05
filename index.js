// Import express.js in index.js file

const express = require('express')

// Import cors

const cors = require('cors')


// import Logic,js

const logic = require('./services/logic')

// import jsonwebtoken

const jwt = require('jsonwebtoken')



// create server app using express in index.js

const server = express()

//  Using cors specify the origin to server app that should share data

server.use(cors({
    origin: 'http://localhost:4200'
}))

// Use json parser in server app

server.use(express.json())

// Set up port number for server app 

server.listen(3000, () => {

    console.log("bank server is listening at port number 3000");

})

// token verification middleware
const jwtMiddleware = (req,res,next)=>{
    console.log("Router Specific Middleware");
    // get token from request headers
    const token = req.headers['verify-token']
    try{
        // verify token
        const data = jwt.verify(token,"supersecretkey123")
        console.log(data);
        req.currentAcno=data.loginAcno
        //  to resolve user request
        next()
        }
        catch{
            res.status(401).json({message:"Please Login"})
        }
    

}

// REST API: GET ,POST ,PUT, DELETE
//  REST SERVER API
// register api- http request post(http://localhost:3000/register,body)

server.post('/register', (req, res) => {
    console.log("Inside resister Api");
    console.log(req.body);
    // 1.get acno,uname and pswd from request body
    logic.register(req.body.acno, req.body.uname, req.body.pswd)
      .then((result)=>{
        //  send result to client
       res.status(result.statusCode).json(result)
      })
})

//login api-

server.post('/login',(req,res)=>{
    console.log('inside login API');
    console.log(req.body);
    // get acno and pswd from req
    logic.login(req.body.acno,req.body.pswd)
    .then((result)=>{
           res.status(result.statusCode).json(result)
           console.log(result);
    })
    //  call login method in logic.js
    //  send response to client
})

//getbalance api-

server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('inside getBalance API');
    console.log(req.params);
    // get acno and pswd from req
    logic.getBalance(req.params.acno)
    .then((result)=>{
           res.status(result.statusCode).json(result)
    })
})
//fundTransfer api-jwtMiddleware router specific middleware
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundtransfer API');
    console.log(req.body);
    //get acno and pswd from req
    //call fundTransfer method in logic.js
    logic.fundTransfer(req.currentAcno,req.body.pswd,req.body.toAcno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
//transaction history api
server.get('/transacion-history',jwtMiddleware,(req,res)=>{
 console.log('Inside transactionhistory api');
 console.log(req.body);
 //call transaction logic
 logic.transactionHistory(req.currentAcno)
 .then((result)=>{
    res.status(result.statusCode).json(result)
 })
})
server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('Inside delete api');
    logic.deleteAcno(req.currentAcno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})