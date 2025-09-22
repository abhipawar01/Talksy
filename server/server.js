import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req,res)=> res.send('Server is running...'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})