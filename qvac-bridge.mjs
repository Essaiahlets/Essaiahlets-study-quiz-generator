import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";
let modelId = null;
export async function generateQuiz(topic, count, difficulty) {
  console.log("Loading QVAC model...");
  if (!modelId) {
    modelId = await loadModel({
      modelSrc: LLAMA_3_2_1B_INST_Q4_0,
      onProgress: (progress) => {
        if (progress?.percentage !== undefined) {
          console.log(`QVAC Loading: ${progress.percentage}%`);
        }
      }
    });
    console.log("QVAC model loaded successfully!");
  }
  const history = [
    {
      role: "user",
      content: `You are a study quiz generator.
Create a quiz about: ${topic}
Difficulty: ${difficulty}
Number of questions: ${count}
Return ONLY valid JSON.
Do not use markdown.
Do not include explanations outside the JSON.
Use exactly this format:
{
  "questions": [
    {
      "question": "Question text",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "answer": "A",
      "explanation": "Short explanation"
    }
  ]
}
Requirements:
- Create exactly ${count} questions.
- Every question must have exactly four choices.
- Choices must be labeled A, B, C, and D.
- The answer must be one of A, B, C, or D.
- Make the questions useful for a student studying ${topic}.
- Match the requested ${difficulty} difficulty.
- Return JSON only.`
    }
  ];
  console.log(`Generating ${count} questions about ${topic}...`);
  const result = completion({
    modelId,
    history,
    stream: true
  });
  let output = "";
  for await (const token of result.tokenStream) {
    output += token;
  }
  console.log("QVAC generation completed.");
  return output;
}
export async function shutdownQVAC() {
  if (modelId) {
    console.log("Unloading QVAC model...");
    await unloadModel({
      modelId
    });
    modelId = null;
    console.log("QVAC model unloaded.");
  }
}