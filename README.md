# 🧠 AI Study Quiz Generator

An Electron desktop application that uses Tether’s QVAC JavaScript SDK to generate personalized study quizzes using on-device AI.

The application allows users to enter a study topic, select the number of questions and difficulty level, and generate an interactive quiz using a locally loaded AI model.

## ✨ Features

* 📝 Enter any study topic
* 🔢 Choose the number of questions
* 🎯 Choose quiz difficulty
* 🤖 Generate quizzes using on-device AI
* 💻 Electron desktop application
* 🔒 AI inference runs locally through QVAC
* 📊 Automatic quiz scoring
* 📖 Answer key and explanations
* ⚡ QVAC model lifecycle management with `loadModel()` and `unloadModel()`

---

## 🛠️ Technologies

* Electron
* JavaScript
* Node.js
* HTML
* Tether QVAC SDK
* Electron IPC

### QVAC SDK

This project uses:

```bash
npm install @qvac/sdk
```

QVAC SDK version:

```text
0.20.0
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Essaiahlets/Essaiahlets-study-quiz-generator.git
```

Enter the project directory:

```bash
cd Essaiahlets-study-quiz-generator
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running the Application

Start the Electron application:

```bash
npm start
```

The application will open in a desktop window.

---

## 🧩 How It Works

1. Enter a study topic.
2. Select the number of questions.
3. Select the quiz difficulty.
4. Click Generate Quiz.
5. The Electron renderer sends the request through IPC.
6. The Electron main process loads the local QVAC AI model using `loadModel()`.
7. QVAC `completion()` performs the AI inference locally.
8. The generated response is collected from the QVAC completion stream.
9. The application parses and validates the generated JSON.
10. The quiz is returned to the renderer through IPC.
11. The generated quiz is displayed in the Electron application.
12. The user answers the questions and submits the quiz.
13. The application calculates the score and displays the answer key.
14. After AI generation is complete, `unloadModel()` releases the loaded model.

---

## 🔌 Electron IPC Architecture

The application uses Electron IPC to communicate between the renderer process and the main process.

```text
┌─────────────────────────┐
│   Electron Renderer     │
│                         │
│   Topic / Questions /   │
│   Difficulty            │
└────────────┬────────────┘
             │
             │ IPC
             ▼
┌─────────────────────────┐
│     Electron Main       │
│                         │
│   QVAC SDK Integration  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        QVAC SDK         │
│                         │
│       loadModel()       │
│           ↓             │
│       completion()      │
│           ↓             │
│      unloadModel()      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Generated Quiz JSON   │
└─────────────────────────┘
```

---

## 🤖 QVAC Implementation

The application directly uses the QVAC JavaScript SDK.

### 1. Load the Model

The application loads a local Llama model using QVAC:

```javascript
const modelId = await loadModel({
  modelSrc: LLAMA_3_2_1B_INST_Q4_0,
  modelType: "llm"
});
```

`loadModel()` prepares the local AI model for inference.

---

### 2. Generate the Quiz with `completion()`

After the model is loaded, the application sends the quiz-generation prompt to QVAC:

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

The application collects the generated tokens from the QVAC completion stream and converts the output into quiz JSON.

The generated quiz contains:

* Questions
* Four answer choices
* Correct answer
* Explanation

---

### 3. Unload the Model

After AI generation is finished, the application releases the loaded model:

```javascript
await unloadModel({
  modelId
});
```

This keeps the QVAC model lifecycle controlled and releases the model resources after generation.

---

## 🧠 On-Device AI

The quiz generation is performed using the QVAC SDK and a locally loaded AI model.

The application does not send the quiz-generation prompt to a cloud AI API.

The QVAC flow is:

```text
loadModel()
     ↓
completion()
     ↓
Collect generated tokens
     ↓
Parse JSON
     ↓
Validate quiz
     ↓
unloadModel()
```

---

## 📊 Quiz Generation

The application validates the generated QVAC output to ensure that:

* The requested number of questions is returned.
* Every question contains four answer choices.
* Each question contains a valid correct answer.
* The generated response can be parsed as JSON.
* Invalid or incomplete model output is handled before displaying the quiz.

---

## 🎯 Quiz Experience

After generation, users can:

1. Read each question.
2. Select an answer.
3. Submit the quiz.
4. See their score.
5. Review the correct answers.
6. Read the explanations.
7. Generate another quiz.

---

## 📦 QVAC Requirement

This project declares QVAC as a project dependency.

The application directly calls QVAC SDK APIs including:

* `loadModel()`
* `completion()`
* `unloadModel()`

The primary AI inference is performed locally through QVAC.

---

## 🖥️ Application Flow

```text
User enters topic
        ↓
Select questions
        ↓
Select difficulty
        ↓
Generate Quiz
        ↓
Electron IPC
        ↓
QVAC loadModel()
        ↓
QVAC completion()
        ↓
Parse & validate JSON
        ↓
Display quiz
        ↓
User answers quiz
        ↓
Calculate score
        ↓
Display answer key
        ↓
QVAC unloadModel()
```

---

## 📜 License

This project is licensed under the MIT License.

See the LICENSE file for details.

---

## 🙌 Why I Built This

I built this project to explore how on-device AI can be used to create a practical desktop study tool without relying on a cloud AI API.

The goal is to make quiz generation simple, interactive, and powered by local AI through the QVAC SDK.
