import mongoose from "mongoose";

const connectDB = async (uri) => {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((err) => console.log('Error connecting to MongoDB:', err));
}

export default connectDB;