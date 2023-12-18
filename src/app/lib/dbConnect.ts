// source from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose
import mongoose from "mongoose";
declare global {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
	var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (cached.conn) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
		return cached.conn;
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		cached.promise = mongoose.connect(MONGODB_URI, opts).then((resMongoose) => {
			return resMongoose;
		});
	}
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
		cached.conn = await cached.promise;
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		cached.promise = null;
		throw e;
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
	return cached.conn;
}

export default dbConnect;
