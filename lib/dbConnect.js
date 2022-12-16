import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
		cached.promise = mongoose.connect(MONGODB_URL, opts).then((conn) => {
			console.log('Mongodb Connected');
			return conn;
		});
	}

	cached.conn = await cached.promise;

	return cached.conn;
}

export default dbConnect();
