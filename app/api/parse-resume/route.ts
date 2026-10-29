import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: NextRequest) {
	try {
		if (!ai) {
			return NextResponse.json(
				{ error: "GEMINI_API_KEY is not configured on the server." },
				{ status: 500 },
			);
		}

		const formData = await req.formData();
		const file = formData.get("resume") as File | null;

		if (!file) {
			return NextResponse.json(
				{ error: "No resume file uploaded." },
				{ status: 400 },
			);
		}

		// Convert file to array buffer and then base64
		const arrayBuffer = await file.arrayBuffer();
		const base64Data = Buffer.from(arrayBuffer).toString("base64");
		const mimeType = file.type || "application/pdf";

		const responseSchema = {
			type: "OBJECT",
			properties: {
				name: { type: "STRING", description: "The candidate's full name" },
				title: {
					type: "STRING",
					description:
						"A short professional headline, e.g., 'Full Stack Developer', 'Data Engineer'",
				},
				bio: {
					type: "STRING",
					description:
						"A professional summary bio of the candidate (1-3 sentences max)",
				},
				skills: {
					type: "OBJECT",
					properties: {
						frontend: {
							type: "ARRAY",
							items: { type: "STRING" },
							description: "Frontend technologies, libraries, or frameworks",
						},
						backend: {
							type: "ARRAY",
							items: { type: "STRING" },
							description: "Backend technologies, languages, or frameworks",
						},
						database: {
							type: "ARRAY",
							items: { type: "STRING" },
							description: "Databases, storage, or cache systems",
						},
					},
					required: ["frontend", "backend", "database"],
				},
				projects: {
					type: "ARRAY",
					items: {
						type: "OBJECT",
						properties: {
							name: { type: "STRING", description: "Name of the project" },
							description: {
								type: "STRING",
								description: "Brief overview of what the project does",
							},
							tech: {
								type: "ARRAY",
								items: { type: "STRING" },
								description: "List of technologies used in the project",
							},
							github: {
								type: "STRING",
								description: "GitHub repository link or empty string if not found",
							},
							live: {
								type: "STRING",
								description: "Live URL / deployment link or empty string if not found",
							},
						},
						required: ["name", "description", "tech", "github", "live"],
					},
					description: "Top projects mentioned in the resume (aim for 2-4 key projects)",
				},
				github: {
					type: "STRING",
					description: "GitHub profile link or username, or empty string",
				},
				email: {
					type: "STRING",
					description: "Candidate's email address, or empty string",
				},
				linkedin: {
					type: "STRING",
					description: "LinkedIn profile link, or empty string",
				},
			},
			required: [
				"name",
				"title",
				"bio",
				"skills",
				"projects",
				"github",
				"email",
				"linkedin",
			],
		};

		// Call Gemini model with fallback to gemini-1.5-flash if gemini-2.5-flash is busy/unavailable
		let response;
		try {
			response = await ai.models.generateContent({
				model: "gemini-2.5-flash",
				contents: [
					{
						inlineData: {
							data: base64Data,
							mimeType: mimeType,
						},
					},
					"Please analyze this resume and extract the fields required in the JSON schema. Use standard values for skills and fill out the arrays carefully. Keep description summaries concise. If fields are not available in the resume, use empty values (empty strings or empty arrays).",
				],
				config: {
					responseMimeType: "application/json",
					responseSchema: responseSchema as any,
					temperature: 0.1, // Low temperature for factual extraction
				},
			});
		} catch (primaryError) {
			console.warn(
				"gemini-2.5-flash failed or busy. Falling back to gemini-1.5-flash.",
				primaryError,
			);
			response = await ai.models.generateContent({
				model: "gemini-1.5-flash",
				contents: [
					{
						inlineData: {
							data: base64Data,
							mimeType: mimeType,
						},
					},
					"Please analyze this resume and extract the fields required in the JSON schema. Use standard values for skills and fill out the arrays carefully. Keep description summaries concise. If fields are not available in the resume, use empty values (empty strings or empty arrays).",
				],
				config: {
					responseMimeType: "application/json",
					responseSchema: responseSchema as any,
					temperature: 0.1,
				},
			});
		}

		const textResult = response.text;
		if (!textResult) {
			throw new Error("Empty response received from Gemini model.");
		}

		const parsedData = JSON.parse(textResult);

		return NextResponse.json({ success: true, data: parsedData });
	} catch (error: any) {
		console.error("Resume parsing error:", error);
		return NextResponse.json(
			{ error: error?.message || "An error occurred during resume parsing." },
			{ status: 500 },
		);
	}
}
