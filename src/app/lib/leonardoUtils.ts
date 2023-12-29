import axios from "axios";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export const PAGESIZE = 50;

export async function downloadImage(
	imagePath: string,
	id: string,
	url: string,
	imageWidth: number,
	imageHeight: number,
	savePreview: boolean,
): Promise<void> {
	const response = await axios.get(url, { responseType: "arraybuffer" });
	try {
		fs.writeFileSync(
			path.join(imagePath, id + ".jpg"),
			response.data as Buffer,
		);
		if (savePreview) {
			await sharp(response.data as Buffer)
				.resize(Math.round(imageWidth / 5), Math.round(imageHeight / 5), {
					fit: sharp.fit.outside,
				})
				.toBuffer()
				.then((data) => {
					fs.writeFileSync(path.join(imagePath, id + "_preview.jpg"), data);
				});
		}
		console.log(`Image [${id}] downloaded successfully!`);
	} catch (error) {
		console.log(error);
	}
}

export async function downloadGenerations(
	offset: number = 0,
	limit: number = PAGESIZE,
): Promise<IGenerations> {
	const config = {
		method: "get",
		maxBodyLength: Infinity,
		url:
      "https://cloud.leonardo.ai/api/rest/v1/generations/user/" +
      process.env.USER_ID +
      "?offset=" +
      offset +
      "&limit=" +
      limit,
		headers: {
			"accept": "application/json",
			"content-type": "application/json",
			"Authorization": "Bearer " + process.env.API_KEY,
		},
	};
	const response = await axios.request(config);
	const data = response.data as IGenerations;
	return data;
}
