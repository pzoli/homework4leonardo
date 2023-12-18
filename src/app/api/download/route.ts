import connection from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import serverPath from "@/app/lib/configHelper";
import { downloadGenerations, downloadImage } from "@/app/lib/leonardoUtils";
import { Generation, GenerationSchema } from "@/app/models/generationModel";

export async function GET(req: NextRequest) {
	const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
	const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
	let count = 0;
	let imageCount = 0;
	let savedCount = 0;
	try {
		await connection();
		const data = await downloadGenerations(offset, limit);
		const imgs: Promise<void>[] = [];
		data.generations.forEach((gen) => {
			Generation.findOne({ generationId: gen.id }).then((existedData) => {
				if (existedData === null) {
					const genarationData: GenerationSchema = {
						userId: process.env.USER_ID as string,
						generationId: gen.id,
						prompt: gen.prompt,
						createdAt: gen.createdAt,
					};
					Generation.create(genarationData).then((_data) => {
						savedCount++;
					}).catch((err) => {
						console.error(err);
					});
				} else {
					console.log(`Generation [${gen.id}] existed`);
				}
				count++;
			}).catch((err) => {
				console.error(err);
			});
			const imagePath = path.join(serverPath("public"), "downloads", gen.id);
			if (!fs.existsSync(imagePath)) {
				fs.mkdirSync(imagePath, { recursive: true });
			}
			const generationJson = JSON.stringify(gen, null, 2);
			fs.writeFileSync(path.join(imagePath, "data.json"), generationJson);

			gen.generated_images.forEach((img) => {
				console.log(img.url);
				imgs.push(downloadImage(imagePath, img.id, img.url));
				imageCount++;
			});
		});
		await Promise.all(imgs);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(error.message);
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
	}
	return NextResponse.json({ success: true, count, imageCount, savedCount });
}
