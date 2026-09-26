import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

async function main() {
  console.log("Loading QVAC model...");

  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (p) => {
      console.log(`Downloading: ${p.percentage.toFixed(0)}%`);
    }
  });

  console.log("Model loaded successfully!");

  const result = completion({
    modelId,
    history: [
      {
        role: "user",
        content:
          "Create one simple multiple-choice study question about JavaScript. Give 4 choices and identify the correct answer."
      }
    ],
    stream: true
  });

  console.log("\nAI OUTPUT:\n");

  for await (const token of result.tokenStream) {
    process.stdout.write(token);
  }

  console.log("\n\nUnloading model...");

  await unloadModel({ modelId });

  console.log("QVAC test completed successfully!");
}

main().catch((error) => {
  console.error("\nQVAC ERROR:");
  console.error(error);
  process.exit(1);
});