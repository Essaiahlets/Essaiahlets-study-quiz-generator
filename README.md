🧠 AI-Powered Study Quiz Generator

An AI-powered desktop study quiz generator built with Tether’s QVAC SDK. The app generates personalized quizzes using AI running directly on the device, without relying on a cloud AI service.

✨ Features

* 🧠 AI-powered quiz generation
* 📚 Generate quizzes from any study topic
* 🔢 Choose the number of questions
* 🎯 Choose quiz difficulty
* ⚡ Runs AI inference on-device
* 🔒 No cloud AI API required for inference
* 💻 Desktop application built with Electron
* 🚀 Powered by Tether’s QVAC SDK

🛠️ Technologies

* JavaScript
* Node.js
* Electron
* Tether QVAC SDK

📋 Requirements

Before running the application, make sure you have:

* Node.js installed
* npm installed
* A computer capable of running Electron and the QVAC model locally

📦 QVAC SDK

This project uses the QVAC JavaScript SDK.

npm install @qvac/sdk

QVAC SDK version: 0.20.0

The QVAC SDK is used to load and run an AI model locally for quiz generation.

🚀 Installation

Clone the repository:

git clone https://github.com/Essaiahlets/Essaiahlets-study-quiz-generator.git

Enter the project directory:

cd Essaiahlets-study-quiz-generator

Install dependencies:

npm install

▶️ Run the Application

Start the Electron application:

npm start

The application will open as a desktop window.

🧪 How It Works

1. Enter a study topic.
2. Select the number of questions.
3. Select the quiz difficulty.
4. Click Generate Quiz.
5. The application loads the QVAC model locally.
6. QVAC performs AI inference on the device.
7. The generated quiz appears in the application.

🤖 QVAC Functions Used

The application uses Tether’s QVAC SDK for local AI inference.

The implementation uses:

* loadModel() to load the AI model locally.
* completion() to generate quiz content.

All AI inference is intended to run locally on the user’s device.

🔐 Privacy

The application is designed to use local AI inference through QVAC. No cloud AI API key is required for quiz generation.

📸 Demo

The application allows users to enter a study topic and generate an AI-powered quiz.

Example:

Study Topic: Philippines History

Questions: 10

Difficulty: Medium

The generated quiz is displayed directly inside the application.

📁 Project Structure

Essaiahlets-study-quiz-generator/
├── app.js
├── index.js
├── index.html
├── qvac-bridge.mjs
├── qvac-test.js
├── package.json
├── package-lock.json
├── LICENSE
└── README.md

📄 License

This project is licensed under the MIT License.

See the LICENSE file for details.

🙌 Acknowledgment

Built using Tether’s QVAC SDK for local, on-device AI inference.

Project: AI-Powered Study Quiz Generator
SDK: Tether QVAC SDK
Platform: Electron / Node.js
AI Processing: On-device