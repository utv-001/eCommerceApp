import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URL, {
        });
        console.log(`Connected to Database: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error in connecting to Database: ${error}`);
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectDB;