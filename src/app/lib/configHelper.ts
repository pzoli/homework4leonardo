import path from "path";
import getConfig from "next/config";

const serverPath = (staticFilePath: string) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT as string, staticFilePath);
};

export default serverPath;
