# 🧠 AI-Powered Study Quiz Generator

An AI-powered desktop study quiz generator built with Tether’s QVAC SDK and Electron.

The application uses QVAC to run a local AI language model on the user’s device and generate multiple-choice study quizzes from a selected topic.

## ✨ Features

* 🧠 AI-powered quiz generation
* 📚 Generate quizzes from any study topic
* 🔢 Choose the number of questions
* 🎯 Choose quiz difficulty
* ⚡ Local, on-device AI inference
* 💻 Electron desktop application
* 🚀 Powered by Tether’s QVAC SDK
* 📋 Automatic answer checking and explanations

## 🛠️ Technologies

* JavaScript
* Node.js
* Electron
* Tether QVAC SDK
* Llama 3.2 1B model

## 🤖 QVAC SDK Implementation

This project uses the QVAC JavaScript SDK:

```bash
npm install @qvac/sdk
```

**QVAC SDK version:** `0.20.0`

The application directly uses the following QVAC APIs:

### `loadModel()`

Loads the Llama model locally on the device.

```javascript
const modelId = await loadModel({
  modelSrc: LLAMA_3_2_1B_INST_Q4_0,
  modelType: "llm"
});
```

### `completion()`

Runs local AI inference using the loaded model.

```javascript
const result = completion({
  modelId,
  history: [
    {
      role: "user",
      content: prompt
    }
  ],
  stream: true
});
```

The generated tokens are collected from the QVAC completion stream and converted into quiz JSON.

## Model Used

`LLAMA_3_2_1B_INST_Q4_0`

The model is loaded through QVAC and used for local quiz generation.

## 🔄 Application Architecture

```text
User
  ↓
Electron UI (index.html)
  ↓
Electron IPC
  ↓
index.cjs
  ↓
app.js
  ↓
Tether QVAC SDK
  ↓
loadModel()
  ↓
LLAMA_3_2_1B_INST_Q4_0
  ↓
completion()
  ↓
Generated Quiz JSON
  ↓
Quiz displayed in Electron UI
```

## 📋 Requirements

* Node.js
* npm
* A computer capable of running Electron and the QVAC model locally

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

Start the Electron application:

```bash
npm start
```

The application will open in a desktop window.

## 🧪 How It Works

1. Enter a study topic.
2. Select the number of questions.
3. Select the quiz difficulty.
4. Click **Generate Quiz**.
5. Electron sends the request through IPC.
6. QVAC loads the local AI model.
7. QVAC `completion()` generates the quiz content.
8. The generated JSON is parsed and validated.
9. The quiz is displayed in the Electron application.
10. The user can answer the questions and submit the quiz.
11. The application calculates the score and displays the answer key.

## 📊 Quiz Generation

The application validates the generated QVAC output to ensure that:

* The requested number of questions is returned.
* Every question contains four options.
* Options use A, B, C, and D.
* Every question contains a valid answer.
* Every question contains an explanation.
* The final response is valid quiz JSON.

For reliability with the local model, quiz generation is performed in small batches and retried when the generated output is incomplete or invalid.

## 🔐 License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

## 🙌 Acknowledgment

Built using Tether’s QVAC SDK for local, on-device AI inference.
