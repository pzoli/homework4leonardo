interface IGenerations {
	generations: IGeneration[];
}

interface IGeneration {
	generated_images: IGeneratedImages[];
	modelId: string;
	prompt: string;
	negativePrompt: string;
	imageHeight: number;
	imageWidth: number;
	inferenceSteps: unknown;
	seed: number;
	public: boolean;
	scheduler: string;
	sdVersion: string;
	status: string;
	presetStyle: string;
	initStrength: number;
	guidanceScale: number;
	id: string;
	createdAt: string;
	promptMagic: boolean;
	promptMagicVersion: unknown;
	promptMagicStrength: unknown;
	photoReal: boolean;
	photoRealStrength: number;
	fantasyAvatar: unknown;
	generation_elements: [
		{
			id: string;
			weightApplied: number;
			lora: {
				akUUID: string;
				baseModel: string;
				description: string;
				name: string;
				urlImage: string;
				weightDefault: number;
				weightMax: number;
				weightMin: number;
			};
		},
	];
}

interface IGeneratedImages {
	url: string;
	nsfw: boolean;
	id: string;
	likeCount: number;
	generated_image_variation_generics: unknown[];
}
