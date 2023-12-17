"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { Toast } from "primereact/toast";
import { show } from "@/app/lib/MessageToast";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Fieldset } from "primereact/fieldset";
import { classNames } from "primereact/utils";
import axios from "axios";

interface FormValues {
	offset: number;
	limit: number;
}

const DownloadImages = () => {

	const schema = z.object({
		offset: z.number().min(0),
		limit: z.number().min(0).max(50),
	});

	const [isDownloading, setIsDownloading] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	const toast = useRef<Toast>(null);

	useEffect(() => {
		setValue("offset", 0);
		setValue("limit", 50);
	}, []);

	const onSubmitError = (submitErrors: FieldErrors<FormValues>) => {
		//console.log(errors);
		show(toast,
			"error",
			"Please fill form as needed." + JSON.stringify(submitErrors, null, 2),
		);
	};

	const onSubmit = (data: FormValues) => {
		console.log(data);
		setIsDownloading(true);
		axios.get("/api/download?offset=" + data.offset + "&limit=" + data.limit).then((response) => {
			setIsDownloading(false);
			const { count, imageCount, savedCount } = response.data as { count: number; imageCount: number; savedCount: number; };
			show(toast,
				"success",
				"Downloaded images successfully. (Saves generation count: (" + savedCount + " / " + count + "), downloaded image count:" + imageCount + ")",
			);
		}).catch((error) => {
			console.log(error);
			setIsDownloading(false);
			show(toast,
				"error",
				"Error while downloading images.",
			);
		});
	};

	const onDayDownload = () => {
		setIsDownloading(true);
		axios.get("/api/dailydownload").then((response) => {
			console.log(response);
			setIsDownloading(false);
			const { count, imageCount, savedCount } = response.data as { count: number; imageCount: number; savedCount: number; };
			show(toast,
				"success",
				"Downloaded images successfully. (Saves generation count: (" + savedCount + " / " + count + "), downloaded image count:" + imageCount + ")",
			);
		}).catch((error) => {
			console.log(error);
			setIsDownloading(false);
			show(toast,
				"error",
				"Error while downloading images.",
			);
		});
	};

	return (
		<main>
			{isDownloading && (
				<div className="absolute w-full h-full surface-400 opacity-50 top-0 left-0 z-5 flex justify-content-center align-items-center">
					<ProgressSpinner
						style={{ width: "50px", height: "50px" }}
						strokeWidth="8"
						fill="var(--surface-ground)"
						animationDuration=".5s"
					/>
				</div>
			)}

			<Toast ref={toast} />
			<div className="align-items-center justify-content-center">
				<h1 className="flex align-items-center justify-content-center">Download Images</h1>
				<Fieldset className="flex align-items-center justify-content-center" legend="By pagination" style={{ width: "50%", margin: "auto" }}>
					<form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
						<Controller
							name="offset"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<div className="grid align-items-baseline">
										<div className="col-12 mb-2 md:col-2 md:mb-0">
											<label>Offset</label>
										</div>
										<div className="col-12 md:col-10">
											<InputNumber
												id={field.name}
												value={field.value || 0}
												tooltip={errors.offset?.message}
												className={classNames({
													"p-invalid": fieldState.invalid,
												})}
												onValueChange={(event) =>
													field.onChange(event.target.value as number)
												}
											/>
										</div>
									</div>
								</>
							)}
						/>
						<Controller
							name="limit"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<div className="grid align-items-baseline">
										<div className="col-12 mb-2 md:col-2 md:mb-0">
											<label htmlFor={field.name}>Limit</label>
										</div>
										<div className="col-12 md:col-10">
											<InputNumber
												id={field.name}
												value={field.value || 50}
												tooltip={errors.limit?.message}
												className={classNames({
													"p-invalid": fieldState.invalid,
												})}
												onValueChange={(event) =>
													field.onChange(event.target.value as number)
												}
											/>
										</div>
									</div>
								</>
							)}
						/>
						<div className="flex justify-content-end">
							<Button label="Submit" type="submit" icon="pi pi-check" />
						</div>
					</form>
				</Fieldset>
				<Fieldset legend="By day" className="flex align-items-center justify-content-center" style={{ paddingTop: 10, width: "50%", margin: "auto" }}>
					<Button label="Download Today's Images" onClick={onDayDownload} />
				</Fieldset>
			</div>
		</main>
	);
};

export default DownloadImages;
