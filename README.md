# Meeting Summarizer

A web application that takes meeting audio files, transcribes them using the Groq Whisper API, and generates concise summaries with key decisions and action items using the Groq Llama 3.1 API. Built for speed and efficiency.

## Features

* **Audio Upload:** Simple interface to upload common audio formats (MP3, WAV, M4A, OGG, etc.).
* **Fast Transcription:** Utilizes Groq's LPU™ Inference Engine via their API for incredibly fast audio-to-text transcription using Whisper Large v3.
* **AI Summarization:** Leverages Groq's API with Llama 3.1 to generate structured summaries (key decisions and action items) in JSON format.
* **Clear Display:** Presents both the full transcript and the structured summary on the web page.
* **Simple & Secure:** Uses environment variables to securely store API keys.

## Tech Stack

* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **File Upload:** Multer
* **API Client:** Axios
* **Transcription:** Groq API (Whisper Large v3)
* **Summarization:** Groq API (Llama 3.1 8B Instant)
* **Environment Variables:** dotenv

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js and npm installed (LTS version recommended)
* Git installed
* A free Groq API Key (see [How to Get Your Free Groq API Key](#how-to-get-your-free-groq-api-key))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/meeting-summarizer.git](https://github.com/YOUR_USERNAME/meeting-summarizer.git)
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

2.  **Navigate to the project directory:**
    ```bash
    cd meeting-summarizer
    ```

3.  **Install NPM packages:**
    ```bash
    npm install
    ```

4.  **Create your environment file:**
    Copy the example file to create your own `.env` file.
    ```bash
    cp .env.example .env
    ```

5.  **Add your Groq API Key:**
    Open the `.env` file you just created and paste your Groq API key:
    ```env
    GROQ_API_KEY="gsk_YourActualGroqApiKeyHere"
    ```

6.  **Start the server:**
    ```bash
    npm start
    ```
    Or use `nodemon` if you have it installed for automatic restarts during development:
    ```bash
    nodemon index.js
    ```

7.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3000` (or the port specified in your console).

## Usage

1.  Open the application in your browser (`http://localhost:3000`).
2.  Click the "Choose File" button and select an audio file from your computer.
3.  Click the "Summarize" button.
4.  Wait a few moments for the transcription and summarization process to complete (you'll see a loading indicator).
5.  The generated summary (Key Decisions & Action Items) and the full transcript will appear on the page.

## API Endpoint

The backend provides a single API endpoint:

* **`POST /api/summarize`**
    * **Description:** Accepts an audio file upload, transcribes it, summarizes the transcript, and returns both.
    * **Request:** `multipart/form-data` containing an `audio` field with the uploaded file.
    * **Response:** JSON object
        ```json
        {
          "transcript": "The full transcribed text...",
          "summary": {
            "key_decisions": ["Decision 1...", "Decision 2..."],
            "action_items": [
              {"task": "Task description...", "owner": "Name or Unassigned"},
              {"task": "Another task...", "owner": "Name"}
            ]
          }
        }
        ```
    * **Error Response:** JSON object `{ "error": "Error message..." }` with appropriate status code (400, 500).

## Environment Variables

To run this project, you need to create a `.env` file in the root directory and add the following environment variable:

* `GROQ_API_KEY`: Your secret API key obtained from [GroqCloud](https://console.groq.com/keys).

See the `.env.example` file for a template.

**Important:** The `.env` file is included in `.gitignore` and should **never** be committed to version control.

## How to Get Your Free Groq API Key

1.  Go to [GroqCloud Console](https://console.groq.com/).
2.  Sign up for a free account or log in.
3.  Navigate to the "API Keys" section in the left sidebar.
4.  Click "Create API Key".
5.  Give your key a name (e.g., `meeting-summarizer-key`) and click "Create".
6.  **Immediately copy the displayed API key** and paste it into your `.env` file. You won't be able to see the full key again.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source. Feel free to use it as you wish. (Consider adding a specific license like MIT if desired).
