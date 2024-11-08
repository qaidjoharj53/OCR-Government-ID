const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");
const sharp = require("sharp");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Preprocess image with sharp before OCR
app.post("/upload", upload.single("file"), async (req, res) => {
	const filePath = path.join(__dirname, req.file.path);
	const { documentType } = req.body;
	// Preprocess the image to improve OCR accuracy
	const preprocessedPath = `${filePath}-preprocessed.png`;

	try {
		await sharp(filePath)
			.resize(1000) // Resize to 1000px width to improve OCR resolution
			.grayscale() // Convert to grayscale
			.sharpen() // Sharpen the image
			.normalise() // Improve contrast
			.toFile(preprocessedPath);

		// Perform OCR on the preprocessed image
		const ocrResult = await Tesseract.recognize(preprocessedPath, "eng");
		const extractedText = ocrResult.data.text;

		// Save OCR output to JSON file (optional for debugging)
		const jsonData = { extractedText };
		await fs.writeJson("data.json", jsonData);

		// Apply regex based on the document type
		const extractedInfo = extractDetailsFromText(
			extractedText,
			documentType
		);
		res.json(extractedInfo);
	} catch (error) {
		console.error("Error processing file:", error);
		res.status(500).json({
			error: "Error processing file",
			details: error.message,
		});
	} finally {
		await fs.remove(filePath);
	}
});

app.get("/", (req, res) => {
	res.send("Server is running");
});

app.listen(5000, () => {
	console.log("Server is running on http://localhost:5000");
});

// Function to extract details using document-specific regex patterns
function extractDetailsFromText(text, documentType) {
	// Handle JSON string input
	if (text.startsWith("{")) {
		try {
			text = JSON.parse(text).extractedText;
		} catch (e) {
			console.error("Error parsing JSON:", e);
		}
	}

	// Normalize the text by replacing multiple spaces and newlines with a single space
	const normalizedText = text.replace(/\s+/g, " ").trim();

	let details = {
		name: "Not found",
		documentNumber: "Not found",
		expirationDate: "Not found",
		dateOfBirth: "Not found",
	};

	if (documentType === "driving_license") {
		// Generalized patterns for Driving License
		const dlPatterns = {
			// Name: capturing uppercase letters and spaces, ending at common delimiters
			name: /Name\s*[:.-]*©?\s*([A-Z\s]+?)(?=\s*(?:S\/|D\/|W\/|DOB|Date of Birth|BG|,|$|\n))/i,

			// Document Number: capturing any alphanumeric license number
			documentNumber:
				/(?:DL\s*No\.?|License\s+No\.?)\s*©?\s*([A-Z0-9\s]+?)(?=\s+(?:DOI|Date|Valid|Expiry|$|\n))/i,

			// Expiration Date: accounting for different keywords and date formats
			expirationDate:
				/(?:Valid Till|Valid upto|Validity|Expiry)\s*[:.-]*\s*©?\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,

			// Date of Birth: capturing DOB with variations in separator symbols
			dateOfBirth:
				/(?:DOB|Date of Birth)\s*[:.-]*\s*©?\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,
		};

		// Extract details for driving license
		Object.entries(dlPatterns).forEach(([key, pattern]) => {
			const match = normalizedText.match(pattern);
			if (match && match[1]) {
				details[key] = match[1].trim();
			}
		});

		// Clean up expiration date by removing extra spaces
		if (details.expirationDate !== "Not found") {
			details.expirationDate = details.expirationDate.replace(/\s+/g, "");
		}
	} else if (documentType === "passport") {
		// Generalized patterns for Passport

		// Extract passport number (letter followed by 7-8 digits)
		const passportMatch = normalizedText.match(/[A-Z][0-9]{7,8}/i);
		if (passportMatch) {
			details.documentNumber = passportMatch[0].toUpperCase();
		}

		// Try to extract name from MRZ first
		const mrzMatch = normalizedText.match(/P<[A-Z]{3}([A-Z]+)<<([A-Z]+)/);
		if (mrzMatch) {
			const surname = mrzMatch[1].replace(/</g, " ").trim();
			const givenNames = mrzMatch[2].replace(/</g, " ").trim();
			details.name = `${surname} ${givenNames}`.trim();
		} else {
			// Fallback: Look for consecutive capital words
			const nameMatch = normalizedText.match(
				/(?<!(?:Valid|Signature|Authority|Place|Date|Passport|No)\s+)[A-Z][A-Z]+(?:\s+[A-Z][A-Z]+){1,2}(?!\s+(?:INDIA|PASSPORT|REPUBLIC))/
			);
			if (nameMatch) {
				details.name = nameMatch[0].trim();
			}
		}

		// Extract dates in DD/MM/YYYY format
		const dateMatches = [
			...normalizedText.matchAll(/(\d{2}\/\d{2}\/\d{4})/g),
		];
		if (dateMatches.length >= 2) {
			details.dateOfBirth = dateMatches[0][0];
			details.expirationDate = dateMatches[dateMatches.length - 1][0];
		}
	}

	// Final cleanup of all extracted data
	return Object.fromEntries(
		Object.entries(details).map(([key, value]) => [
			key,
			value.replace(/\s+/g, " ").trim(),
		])
	);
}
