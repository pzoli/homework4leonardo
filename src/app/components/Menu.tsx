"use client";
import { Menubar } from "primereact/menubar";
import { ProgressSpinner } from "primereact/progressspinner";
import { useState } from "react";

export default function MainMenu() {
	const [loading, setLoading] = useState(false);

	const items = [
		{
			label: "Download",
			icon: "pi pi-fw pi-file",
			command: () => {
				setLoading(true); window.location.href = "/pages/download";
			},
		},
		{
			label: "Images",
			icon: "pi pi-fw pi-file",
			command: () => {
				setLoading(true); window.location.href = "/";
			},
		},
	];

	return (
		<>
			{loading && (
				<div className="absolute w-full h-full surface-400 opacity-50 top-0 left-0 z-5 flex justify-content-center align-items-center">
					<ProgressSpinner
						style={{ width: "50px", height: "50px" }}
						strokeWidth="8"
						fill="var(--surface-ground)"
						animationDuration=".5s"
					/>
				</div>
			)}

			<Menubar model={items}
			/>
		</>
	);

}
