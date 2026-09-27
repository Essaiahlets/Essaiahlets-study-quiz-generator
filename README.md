# 🧠 AI-Powered Study Quiz Generator

An AI-powered desktop study quiz generator built with **Tether's QVAC SDK**. The app generates quizzes using AI running directly on the device.

## ✨ Features

* 🧠 AI-powered quiz generation
* 📚 Generate quizzes from a study topic
* 🔢 Choose the number of questions
* 🎯 Choose quiz difficulty
* ⚡ On-device AI inference
* 💻 Electron desktop application
* 🚀 Powered by Tether's QVAC SDK

## 🛠️ Technologies

* JavaScript
* Node.js
* Electron
* Tether QVAC SDK

## 📋 Requirements

* Node.js
* npm
* A computer capable of running Electron and the QVAC model locally

## 📦 QVAC SDK

This project uses the **QVAC JavaScript SDK**.

```bash
npm install @qvac/sdk
```

**QVAC SDK version:** `0.20.0`

The QVAC SDK is used to load and run an AI model locally for quiz generation.

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Essaiahlets/Essaiahlets-study-quiz-generator.git
```

Enter the project folder:

```bash
cd Essaiahlets-study-quiz-generator
```

Install dependencies:

```bash
npm install
```

## ▶️ Run the Application

```bash
npm start
```

The application will open as a desktop window.

## 🧪 How It Works

1. Enter a study topic.
2. Select the number of questions.
3. Select the quiz difficulty.
4. Click **Generate Quiz**.
5. QVAC loads the AI model locally.
6. The AI generates the quiz.
7. The quiz appears in the application.

## 🤖 QVAC Functions

The application uses:

* `loadModel()` — loads the AI model.
* `completion()` — generates the quiz content.

## 📸 Example

**Study Topic:** Philippines History
**Questions:** 10
**Difficulty:** Medium

The generated quiz is displayed directly inside the application.

## 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

## 🙌 Acknowledgment

Built using **Tether's QVAC SDK** for local, on-device AI inference.
