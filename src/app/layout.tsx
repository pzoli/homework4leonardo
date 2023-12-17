import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/provider";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import MainMenu from "./components/Menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "LeonardoAI - Download Images",
	description: "Application to download images from the web",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<MainMenu />
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
