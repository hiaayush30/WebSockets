import express from 'express';
const app=express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({
        message:'we are on'
    })
})

app.listen(3000,()=>{
    console.log('server running on '+3000);
})