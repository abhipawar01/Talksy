import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectDB();
//middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req,res)=> res.send('Server is running...'));
app.use('/api/user',userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})