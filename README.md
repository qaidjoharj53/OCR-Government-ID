# 🏷️ **GovID Extractor**

## 📖 **Overview**

GovID Extractor is a powerful web application designed to extract crucial information from government-issued documents such as **passports** and **driving licenses**. Using **OCR (Optical Character Recognition)** technology powered by **Tesseract.js**, the application enables users to upload images of their documents and automatically retrieve key details like name, document number, and expiration date. The intuitive user interface ensures a seamless experience for document handling and data extraction.

---

## 🚀 **Key Features**

-   **Effortless Document Upload**: Upload images of government-issued IDs and documents.
-   **Automatic OCR Processing**: Leverages Tesseract.js for fast and accurate text extraction.
-   **Document Type Selection**: Choose between various document types (e.g., Passport, Driving License) for targeted extraction.
-   **Data Extraction**: Quickly extract key information:
    -   📛 **Name**
    -   🆔 **Document Number**
    -   📅 **Expiration Date**

---

## 🖥️ **Tech Stack**

This project utilizes a range of technologies to ensure scalability, speed, and reliability:

-   **Frontend**: React.js for dynamic and responsive UI.
-   **Backend**: Node.js with Express.js for building the API and handling server-side logic.
-   **OCR Engine**: Tesseract.js for text recognition from images.
-   **File Upload**: Multer for handling file uploads.
-   **Data Storage**: JSON for storing extracted data temporarily.

---

## 🌐 **Getting Started**

### 📦 **Prerequisites**

Make sure you have the following installed:

-   **Node.js** (v18 or higher)
-   **npm** (Node Package Manager)

### 🔧 **Installation Steps**

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/qaidjoharj53/OCR-Government-ID.git
    cd OCR-Government-ID
    ```

2. **Install Dependencies**:

    Install the necessary backend and frontend dependencies:

    ```bash
    npm install
    ```

3. **Start the Backend Server**:

    Run the backend server:

    ```bash
    node server.js
    ```

    The server will be available at `http://localhost:5000`.

4. **Run the Frontend**:

    In a separate terminal, navigate to the frontend directory and start the React app:

    ```bash
    npm start
    ```

    The frontend will be available at `http://localhost:3000`.

---

## 📁 **Project Structure**

Here is an overview of the project directory:

```
├── frontend/ # React frontend code
├── uploads/ # Temporary storage for uploaded files
├── server.js # Node.js backend server code
├── package.json # Project metadata and dependencies
├── README.md # This documentation
└── .gitignore # Git ignore file
```

---

## 🎨 **UI Components**

The web app features simple yet effective UI elements:

-   **File Upload Button**: To upload documents.
-   **Document Type Dropdown**: Allows users to select the type of document (e.g., Passport, Driving License).
-   **OCR Results Display**: A section that showcases the extracted details (name, document number, expiration date).

---

## 📄 **Usage**

1. **Select Document Type**: Choose the type of document you're uploading (e.g., Driving License or Passport).
2. **Upload Document**: Click on the "Upload" button to select your file.
3. **View Extracted Data**: The OCR engine will process the document, and the extracted information will be displayed on the screen.

---

## 📚 **Example Output**

For example, after uploading a **driving license**, the extracted data might look like:

```json
{
	"name": "Name Surname",
	"documentNumber": "MH17 20160001642",
	"expirationDate": "11-01-2036"
}
```

## 🛠️ Future Enhancements

-   Additional Document Types: Support for more document types like national ID cards, voter ID, etc.
-   Improved OCR Accuracy: Implement custom-trained data for more precise OCR results.
-   User Authentication: Allow users to save and access their scanned documents securely.
-   Mobile Support: Build a mobile-friendly version for better accessibility.

## 💬 Contributing

We welcome contributions from developers who want to improve this project! To contribute:

```
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them.
4. Push your changes to your branch.
5. Open a pull request to the main branch.
6. Wait for the code review and merge.
7. Once merged, your changes will be live in the main branch.
```

Make sure to follow best coding practices and include tests for any new features or bug fixes.

## Contact Us

For any questions, suggestions, or issues, feel free to reach out to [Qaidjohar Jukker](https://www.qaidjoharjukker.com).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
