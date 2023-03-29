const express = require("express")
const app = express()

const MongoClient = require('mongodb').MongoClient;
const auth = require('./router/routes')
const authMiddleware = require("./middlewares/auth")

const dotenv = require("dotenv")
dotenv.config()

const port = process.env.port

app.use(express.json());



app.use('/', auth)


app.get('/' ,authMiddleware, (req,res)=>{
    res.send('Hello World')
})

const startServer =async () =>{
    
    const client = new MongoClient(process.env.mongoDB_URI)
    db = client.db()
    await client.connect()
    app.listen(port , ()=>{
        console.log(`server started in port ${port}`);
    })
}

startServer()