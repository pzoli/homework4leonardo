"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { GenerationDTO } from "./dtos/generationDTO";
import axios from "axios";
import { Paginator, PaginatorPageChangeEvent } from "primereact/Paginator";
import { MutableRefObject, useRef, useState } from "react";
import dayjs from "dayjs";

export default function Home() {

	const [first, setFirst] = useState(0);
	const [rows] = useState(50);
	const [imageCount, setImageCount] = useState(0);
	const lastDate: MutableRefObject<Date | undefined> = useRef(undefined);

	const { data: generations } = useQuery<GenerationDTO[], Error>({
		queryKey: ["generations", first, rows],
		queryFn: async () => {
			try {
				const resGen = await axios.get("/api/generations?offset=" + first + "&limit=" + rows);
				const dataGen = resGen.data as GenerationDTO[];
				if (dataGen.length === 0) return [];

				const resGenCount = await axios.get("/api/generations/count");
				const { count } = resGenCount.data as { count: number; };
				setImageCount(count);

				const genPromises: Promise<void | GenerationDTO[]>[] = [];
				dataGen.forEach((generation: GenerationDTO) => {
					genPromises.push(axios.get("/api/generations/" + generation.generationId).then((res) => {
						generation.info = JSON.parse(res.data as string) as IGeneration;
					}));
				});
				await Promise.all(genPromises);
				return dataGen;
			} catch (err) {
				console.error(err);
				return [];
			}
		},
	});

	function renderDate(date: Date): JSX.Element {
		const isDiffenertDay = !lastDate.current || lastDate.current.getDate() !== new Date(date).getDate();
		if (isDiffenertDay) {
			lastDate.current = date;
			return (
				<p className={styles.dateheader}>{dayjs(date).format("YYYY-MM-DD")}</p>
			);
		} else return (<></>);
	}

	function renderGeneration(generation: GenerationDTO, data: IGeneration, imageHeight: number, imageWidth: number, imgs: string[]): JSX.Element {
		return (
			<>
				{renderDate(new Date(data.createdAt))}
				<div style={{ borderStyle: "solid", paddingBottom: 10 }} key={generation.generationId}>
					<p style={{ marginLeft: "10px" }}>{data.prompt}</p>
					<div>
						{imgs && imgs.map((img) => {
							if (img.endsWith(".json")) return;
							return (
								<a style={{ padding: "20px", display: "inline" }} href={"/downloads/" + generation.generationId + "/" + img} target="_blank" rel="noreferrer">
									<Image
										src={"/downloads/" + generation.generationId + "/" + img.replace(".jpg", "_preview.jpg")}
										alt={"Image of prompt: " + data.prompt}
										title={"Image [generation: " + generation.generationId + "] [image: " + img + "] (" + data.createdAt + ")"}
										width={imageWidth}
										height={imageHeight}
										priority
									/>
								</a>
							);
						})}
					</div>
				</div>
			</>
		);
	}

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first);
	};

	return (
		<main className={styles.main}>
			<Paginator first={first} rows={rows} totalRecords={imageCount} onPageChange={onPageChange} />
			<div className={styles.description}>
				<div>
					{generations && generations.map((generation) => {
						const data = generation.info;
						if (!data) return;
						const imageHeight = data.imageHeight / 5;
						const imageWidth = data.imageWidth / 5;
						const imgs = data.generated_images.map((img) => img.id + ".jpg");
						return renderGeneration(generation, data, imageHeight, imageWidth, imgs);
					})}
				</div>
			</div>
			<Paginator first={first} rows={rows} totalRecords={imageCount} onPageChange={onPageChange} />
		</main>
	);
}
