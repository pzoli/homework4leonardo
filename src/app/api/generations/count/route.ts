import { Generation } from "@/app/models/generationModel";
import { NextResponse } from "next/server";
import connection from "@/app/lib/dbConnect";

export async function GET() {
	await connection();
	const count = await Generation.find({}).sort({ createdAt: -1 }).countDocuments();
	return NextResponse.json({ count });
}
