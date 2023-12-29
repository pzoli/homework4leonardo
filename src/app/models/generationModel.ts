import mongoose from "mongoose";

export interface GenerationSchema {
	userId: string;
	generationId: string;
	prompt: string;
	createdAt: string;
}

const generationSchema = new mongoose.Schema<GenerationSchema>({
	userId: String,
	generationId: String,
	prompt: String,
	createdAt: String,
});

export const Generation =
  mongoose.models.Generation ||
  mongoose.model<GenerationSchema>("Generation", generationSchema);
