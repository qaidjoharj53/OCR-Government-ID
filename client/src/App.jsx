import React, { useState } from "react";
import axios from "axios";
import Header from "./components/header";
import Footer from "./components/footer";
import "./App.css";

function App() {
	const [file, setFile] = useState(null);
	const [filePreview, setFilePreview] = useState(null); // Temporary URL for image preview
	const [documentType, setDocumentType] = useState(null); // Default type
	const [extractedData, setExtractedData] = useState({});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [selectDocumentType, setSelectDocumentType] = useState(true);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
		setFilePreview(URL.createObjectURL(selectedFile)); // Set preview URL
		setShowInfo(false);
		setSelectDocumentType(true);
		setError(""); // Clear error on new file selection
	};

	const handleTypeChange = (e) => setDocumentType(e.target.value);

	const handleUpload = async () => {
		if (!file) {
			setError("Please select a file to upload.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("documentType", documentType);

		setExtractedData({}); // Clear previous data
		setShowInfo(false);
		setLoading(true); // Show loader

		try {
			const response = await axios.post(
				"http://localhost:5000/upload",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			setExtractedData(response.data);
			setError(""); // Clear any previous errors
		} catch (error) {
			console.error("Error uploading file:", error);
			setError("Error uploading file. Please try again.");
		} finally {
			setLoading(false); // Hide loader after upload
			setShowInfo(true);
			setSelectDocumentType(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setShowInfo(false);
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile) {
			setFile(droppedFile);
			setFilePreview(URL.createObjectURL(droppedFile)); // Set preview URL
			setSelectDocumentType(true);
			setError("");
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setShowInfo(false);
	};

	const renderExtractedData = () => {
		return (
			<div className="data-display">
				{(extractedData.name === "Not found" ||
					extractedData.documentNumber === "Not found" ||
					extractedData.expirationDate === "Not found" ||
					extractedData.dateOfBirth === "Not found") && (
					<p style={{ color: "red", marginTop: "0px" }}>
						Sorry, we couldn't extract some data from the uploaded
						image. Please upload a clear image for best results.
					</p>
				)}
				{documentType === "driving_license" ? (
					<>
						<h2>Driving License Information</h2>
						<p>
							<strong>Name:</strong> {extractedData.name}
						</p>
						<p>
							<strong>Document Number:</strong>{" "}
							{extractedData.documentNumber}
						</p>
						<p>
							<strong>Expiration Date:</strong>{" "}
							{extractedData.expirationDate}
						</p>
						<p>
							<strong>Date of Birth:</strong>{" "}
							{extractedData.dateOfBirth}
						</p>
					</>
				) : documentType === "passport" ? (
					<>
						<h2>Passport Information</h2>
						<p>
							<strong>Name:</strong> {extractedData.name}
						</p>
						<p>
							<strong>Document Number:</strong>{" "}
							{extractedData.documentNumber}
						</p>
						<p>
							<strong>Expiration Date:</strong>{" "}
							{extractedData.expirationDate}
						</p>
						<p>
							<strong>Date of Birth:</strong>{" "}
							{extractedData.dateOfBirth}
						</p>
					</>
				) : null}
				{filePreview && (
					<img
						src={filePreview}
						alt="Uploaded Document Preview"
						style={{
							width: "300px",
							height: "auto",
							marginBottom: "20px",
							border: "1px solid #ccc",
							borderRadius: "5px",
						}}
					/>
				)}
			</div>
		);
	};

	return (
		<>
			<Header />
			<main>
				<div className="app-container">
					<h1>Document Data Extraction</h1>
					<div
						className="upload-section"
						onDrop={handleDrop}
						onDragOver={handleDragOver}>
						<input
							type="file"
							accept="image/jpg, image/jpeg, image/png"
							onChange={handleFileChange}
							style={{ display: "none" }}
							id="file-input"
						/>
						<label
							htmlFor="file-input"
							className="file-upload-label"
							style={{
								border: file
									? "2px dashed #28a745"
									: "2px dashed #ccc",
							}}>
							{file ? (
								file.name
							) : (
								<>
									Drag & Drop your file here or click to
									select.
									<br />
									<br /> Upload landscape-oriented images for
									better results
								</>
							)}
						</label>

						<select
							value={documentType}
							onChange={handleTypeChange}
							disabled={!selectDocumentType}>
							<option value="" disabled={documentType}>
								Select Document Type
							</option>
							<option value="driving_license">
								Driving License
							</option>
							<option value="passport">Passport</option>
						</select>
						<button
							onClick={handleUpload}
							disabled={
								(documentType === null) |
								(documentType === "") |
								(error !== "")
							}>
							{loading ? "Uploading..." : "Upload"}
						</button>
					</div>

					{error && <div className="error-message">{error}</div>}
				</div>
				<div className="app-container">
					{!loading && showInfo ? (
						Object.keys(extractedData).length > 0 &&
						renderExtractedData()
					) : (
						<p>
							Once you upload the image of your ID, the extracted
							data will be displayed here.
						</p>
					)}
				</div>
			</main>
			<Footer />
		</>
	);
}

export default App;
