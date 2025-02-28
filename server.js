// mongo project password c3dIQ9PtfHCsRRyr
// user url mongodb+srv://uzochukwufaustina:c3dIQ9PtfHCsRRyr@cluster2.xwqhl.mongodb.net/
const mongoose = require('mongoose')
const express = require('express');
const multer = require('multer')
require('dotenv').config()
const router = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRoutes');
const routerProduct = require('./routes/ProductRoutes');
const PORT = 2602;

const app = express();
app.use(express.json());

app.use(categoryRouter)
app.use(routerProduct)
app.use(router)

app.use((err, req, res, next)=>{
    if(err)
        return res.status(400).json({
    message: err.message})
    next();
})

mongoose.connect(process.env.DATABASE_URI).then(()=>{
   console.log(' Connected to database Successfully');
  
   app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT :${PORT}`);
})
}).catch((error)=>{
    console.error('Unable to connect to Database ' + error.message);
    
})


