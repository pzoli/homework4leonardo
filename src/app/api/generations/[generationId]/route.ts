import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
const DOWNLOAD_PATH = "./public/downloads";

type Props = {
	params: {
		generationId: string;
	};
};

export function GET(_req: NextRequest, { params: { generationId } }: Props) {
	return NextResponse.json(
		fs.readFileSync(
			path.join(DOWNLOAD_PATH, generationId, "data.json"),
			"utf8",
		),
	);
}
