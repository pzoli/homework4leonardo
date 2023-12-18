import { PAGESIZE, downloadGenerations, downloadImage } from "@/app/lib/leonardoUtils";
import connection from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import path from "path";
import serverPath from "@/app/lib/configHelper";
import fs from "fs";
import { Generation, GenerationSchema } from "@/app/models/generationModel";

export async function GET() {
	let count = 0;
	let imageCount = 0;
	let savedCount = 0;
	try {
		await connection();
		const midnight = dayjs().set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
		let offset = 0;
		let isAfterMidnight = true;
		let data;
		do {
			data = await downloadGenerations(offset);
			if (data.generations.length > 0) {
				const imgs: Promise<void>[] = [];
				try {
					data.generations.forEach((gen) => {
						isAfterMidnight = dayjs(gen.createdAt).isAfter(midnight);
						if (isAfterMidnight) {
							count++;
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
							}).catch((err) => {
								console.error(err);
							});
							const imagePath = path.join(serverPath("public"), "downloads", gen.id);
							if (!fs.existsSync(imagePath)) {
								fs.mkdirSync(imagePath, { recursive: true });
							}
							const gemerationJson = JSON.stringify(gen, null, 2);
							fs.writeFileSync(path.join(imagePath, "data.json"), gemerationJson);

							gen.generated_images.forEach((img) => {
								console.log(img.url);
								imgs.push(downloadImage(imagePath, img.id, img.url));
								imageCount++;
							});
						} else {
							throw new Error("No more images to download");
						}
					});
					offset += PAGESIZE;
				} catch (error: unknown) {
					if (error instanceof Error) {
						console.error(error.message);
					}
				}
				await Promise.all(imgs);
			}
		} while (data.generations.length > 0 && isAfterMidnight);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(error.message);
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
	}
	return NextResponse.json({ success: true, count, imageCount, savedCount });
}
