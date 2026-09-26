import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

const topic = process.argv.slice(2).join(" ") || "JavaScript";

console.log("Loading QVAC model...");

const modelId = await loadModel({
  modelSrc: LLAMA_3_2_1B_INST_Q4_0,
  onProgress: (progress) => {
    if (progress?.percentage !== undefined) {
      console.log(`Loading: ${progress.percentage}%`);
    }
  }
});

console.log("Model loaded successfully!");
console.log(`\nGenerating quiz about: ${topic}\n`);

const history = [
  {
    role: "user",
    content: `Create a study quiz about ${topic}.

Give me exactly 5 multiple-choice questions.

For each question:
- Give 4 choices labeled A, B, C, D.
- Give the correct answer.
- Give a short explanation.

Make the questions useful for a student studying this topic.`
  }
];

const result = completion({
  modelId,
  history,
  stream: true
});

for await (const token of result.tokenStream) {
  process.stdout.write(token);
}

console.log("\n\nQuiz generation completed.");

await unloadModel({ modelId });

console.log("QVAC model unloaded.");