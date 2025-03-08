import { connect } from "mongoose";

const dbConnect = async() => {
    try {
        const mongodbConnection = await connect(process.env.CONNECTION_STRING);
        console.log(`Database is connected : ${mongodbConnection.connection.host}`)
    } catch (error) {
        console.log(`database connection failed ${error}`)
        process.exit(1)
    }
}

export default dbConnect;