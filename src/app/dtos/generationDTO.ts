export interface GenerationDTO {
	userId: string;
	generationId: string;
	prompt: string;
	createdAt: string;
	info?: IGeneration;
}
