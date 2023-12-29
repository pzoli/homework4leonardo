import { Generation } from "@/app/models/generationModel";
import { NextRequest, NextResponse } from "next/server";
import connection from "@/app/lib/dbConnect";

export async function GET(req: NextRequest) {
	await connection();
	const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
	const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

	const generations = await Generation.find({})
		.sort({ createdAt: -1 })
		.skip(offset)
		.limit(limit);
	return NextResponse.json(generations);
}
