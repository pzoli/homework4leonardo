import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
const DOWNLOAD_PATH = "./public/downloads";

type Props = {
	params: {
		generationId: string;
	};
};

export function GET(req: NextRequest, { params: { generationId } }: Props) {
	return NextResponse.json(
		fs.readdirSync(path.join(DOWNLOAD_PATH, generationId)),
	);
}
