🧠 AI-Powered Study Quiz Generator

An AI-powered study quiz generator built with Tether’s QVAC SDK. The app creates personalized quizzes using AI running directly on the device, without relying on a cloud AI service.

✨ Features

* 🧠 AI-powered quiz generation
* 📚 Generate quizzes from any study topic
* 🔢 Choose the number of questions
* 🎯 Choose quiz difficulty
* ⚡ Runs AI inference on-device
* 🔒 No cloud AI API required for inference
* 💻 Desktop app built with Electron
* 🔥 Powered by Tether’s QVAC SDK

🛠️ Technologies

* JavaScript
* Node.js
* Electron
* Tether QVAC SDK

📦 Requirements

Before running the application, make sure you have:

* Node.js installed
* npm installed
* A computer capable of running the Electron application

🚀 Installation

Clone the repository:

git clone https://github.com/Essaiahlets/Essaiahlets-study-quiz-generator.git

Open the project folder:

cd Essaiahlets-study-quiz-generator

Install the dependencies:

npm install

The project uses Tether’s QVAC SDK:

@qvac/sdk 0.20.0

▶️ Run the Application

Start the Electron application with:

npm start

The application will open the Essaiahlets Study Quiz Generator.

Enter a study topic, select the number of questions and difficulty, then click Generate Quiz.

The generated quiz and AI output will be displayed directly in the application.

🤖 QVAC SDK

This project uses Tether’s QVAC SDK to load and run an AI model locally for quiz generation.

QVAC SDK version: 0.20.0

The application uses QVAC’s on-device AI capabilities so that inference is performed locally on the user’s machine instead of sending the request to a cloud AI service.

The application calls QVAC to load the AI model and generate quiz content locally.

QVAC functions used

* loadModel()
* completion()
* unloadModel()

The model is loaded when needed and unloaded when it is no longer required.

🔐 Privacy

The quiz generation is designed to run using on-device AI through Tether’s QVAC SDK.

No external cloud AI API is required to perform the quiz generation.

📸 Example

The application allows users to enter a topic such as:

Philippines History

Users can select:

Questions: 10
Difficulty: Medium

The application then generates a personalized study quiz with AI-generated questions and answer choices.

📁 Project Structure

Essaiahlets-study-quiz-generator/
│
├── app.js
├── index.js
├── index.html
├── qvac-bridge.mjs
├── qvac-test.js
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
└── .gitignore

📄 License

This project is licensed under the MIT License.

See the LICENSE file for the full license text.

🙌 About

Built as a small demonstration of using Tether’s QVAC SDK to create a practical AI application that runs locally on the user’s device.

The goal is to make studying easier by generating personalized quizzes without requiring a cloud AI service.