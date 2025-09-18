import mongoose from "mongoose";
import dotenv from 'dotenv';


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URL}/hewagamaS`)
    } catch (error) {
        console.log (error.message);
    }
    
}

export default connectDB;