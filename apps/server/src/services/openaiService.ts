import type { MaintenanceCategory, Priority } from "@prisma/client";
import OpenAI from "openai";

// Lazy initialization to avoid errors during test imports
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
	if (!openai) {
		openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}
	return openai;
}

export interface VendorInfo {
	id: string;
	name: string;
	category: MaintenanceCategory;
	rating: number | null;
}

export interface ClassificationResult {
	category: MaintenanceCategory;
	priority: Priority;
	vendorId: string | null;
	reasoning: string;
	confidence: number;
}

export interface AILogEntry {
	timestamp: Date;
	requestTitle: string;
	requestDescription: string;
	classification: ClassificationResult;
	availableVendors: VendorInfo[];
}

// In-memory store for AI logs (in production, this would be a database table)
const aiLogs: AILogEntry[] = [];

/**
 * Classifies a maintenance request and recommends a vendor using OpenAI
 */
export async function classifyMaintenanceRequest(
	title: string,
	description: string,
	propertyAddress: string,
	availableVendors: VendorInfo[],
): Promise<ClassificationResult> {
	const categories = [
		"PLUMBING",
		"ELECTRICAL",
		"HVAC",
		"APPLIANCES",
		"LANDSCAPING",
		"PEST_CONTROL",
		"PAINTING",
		"ROOFING",
		"STRUCTURAL",
		"OTHER",
	];

	const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

	const vendorList = availableVendors
		.map(
			(v) =>
				`- ${v.name} (ID: ${v.id}, Category: ${v.category}, Rating: ${v.rating ?? "N/A"})`,
		)
		.join("\n");

	const prompt = `You are an AI assistant for a property management company. Analyze this maintenance request and provide classification.

## Maintenance Request
Title: ${title}
Description: ${description}
Property: ${propertyAddress}

## Available Categories
${categories.join(", ")}

## Priority Levels
- LOW: Can be addressed within 1-2 weeks, no immediate impact on habitability
- MEDIUM: Should be addressed within a few days, minor inconvenience
- HIGH: Should be addressed within 24-48 hours, significant inconvenience or potential damage
- URGENT: Requires immediate attention, safety hazard or major damage in progress

## Available Vendors
${vendorList || "No vendors available"}

## Instructions
1. Classify this request into the most appropriate category
2. Assign a priority level based on urgency and impact
3. Recommend the best vendor based on category match and rating
4. Provide brief reasoning for your decisions
5. Rate your confidence from 0 to 1

Respond with a JSON object only, no additional text:
{
  "category": "CATEGORY_NAME",
  "priority": "PRIORITY_LEVEL",
  "vendorId": "vendor_id_or_null",
  "reasoning": "Brief explanation of classification and vendor selection",
  "confidence": 0.95
}`;

	try {
		const response = await getOpenAIClient().chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a maintenance request classification assistant. Always respond with valid JSON only.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.3,
			max_tokens: 500,
		});

		const content = response.choices[0]?.message?.content;
		if (!content) {
			throw new Error("No response from OpenAI");
		}

		// Parse the JSON response
		const jsonMatch = content.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			throw new Error("Invalid JSON response from OpenAI");
		}

		const result = JSON.parse(jsonMatch[0]) as ClassificationResult;

		// Validate category
		if (!categories.includes(result.category)) {
			result.category = "OTHER" as MaintenanceCategory;
		}

		// Validate priority
		if (!priorities.includes(result.priority)) {
			result.priority = "MEDIUM" as Priority;
		}

		// Validate vendorId
		if (
			result.vendorId &&
			!availableVendors.some((v) => v.id === result.vendorId)
		) {
			result.vendorId = null;
		}

		// Log the AI decision
		aiLogs.push({
			timestamp: new Date(),
			requestTitle: title,
			requestDescription: description,
			classification: result,
			availableVendors,
		});

		return result;
	} catch (error) {
		console.error("OpenAI classification error:", error);

		// Return default classification on error
		return {
			category: "OTHER" as MaintenanceCategory,
			priority: "MEDIUM" as Priority,
			vendorId: null,
			reasoning: "Unable to classify automatically. Manual review required.",
			confidence: 0,
		};
	}
}

/**
 * Get recent AI classification logs
 */
export function getAILogs(limit = 50): AILogEntry[] {
	return aiLogs.slice(-limit).reverse();
}

/**
 * Clear AI logs (for testing)
 */
export function clearAILogs(): void {
	aiLogs.length = 0;
}
