import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

let modelId = null;


// ============================================================
// LOAD QVAC MODEL
// ============================================================

async function ensureModelLoaded() {
  if (modelId) {
    console.log("QVAC model already loaded:", modelId);
    return modelId;
  }

  console.log("=================================");
  console.log("QVAC: Loading AI model...");
  console.log("Model: LLAMA_3_2_1B_INST_Q4_0");
  console.log("=================================");

  try {
    modelId = await loadModel({
      modelSrc: LLAMA_3_2_1B_INST_Q4_0,
      modelType: "llm",

      onProgress: (progress) => {
        if (!progress) return;

        if (typeof progress.percentage === "number") {
          console.log(
            `QVAC model loading: ${progress.percentage.toFixed(0)}%`
          );
        }
      }
    });

    console.log("=================================");
    console.log("QVAC MODEL LOADED SUCCESSFULLY");
    console.log("Model ID:", modelId);
    console.log("=================================");

    return modelId;

  } catch (error) {
    console.error("QVAC MODEL LOAD FAILED:", error);
    modelId = null;
    throw error;
  }
}


// ============================================================
// CLEAN QVAC OUTPUT
// ============================================================

function cleanQvacOutput(rawText) {
  if (!rawText) {
    throw new Error("QVAC returned empty output.");
  }

  let text = String(rawText).trim();

  // Remove markdown code fences
  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return text;
}


// ============================================================
// EXTRACT JSON FROM TEXT
// ============================================================

function extractJsonValue(text) {
  if (!text) {
    return null;
  }

  // ----------------------------------------------------------
  // TRY 1: Parse entire response directly
  // ----------------------------------------------------------

  try {
    return JSON.parse(text);
  } catch (error) {
    // Continue with extraction
  }

  // ----------------------------------------------------------
  // TRY 2: Find JSON array
  // ----------------------------------------------------------

  const arrayStart = text.indexOf("[");
  const arrayEnd = text.lastIndexOf("]");

  if (
    arrayStart !== -1 &&
    arrayEnd !== -1 &&
    arrayEnd > arrayStart
  ) {
    const possibleArray =
      text.substring(arrayStart, arrayEnd + 1);

    try {
      return JSON.parse(possibleArray);
    } catch (error) {
      console.log(
        "Could not parse extracted JSON array."
      );
    }
  }

  // ----------------------------------------------------------
  // TRY 3: Find JSON object
  // ----------------------------------------------------------

  const objectStart = text.indexOf("{");
  const objectEnd = text.lastIndexOf("}");

  if (
    objectStart !== -1 &&
    objectEnd !== -1 &&
    objectEnd > objectStart
  ) {
    const possibleObject =
      text.substring(objectStart, objectEnd + 1);

    try {
      return JSON.parse(possibleObject);
    } catch (error) {
      console.log(
        "Could not parse extracted JSON object."
      );
    }
  }

  return null;
}


// ============================================================
// EXTRACT QUIZ ARRAY
// ============================================================

function extractJsonArray(rawText) {
  if (!rawText) {
    throw new Error("QVAC returned empty output.");
  }

  let text = cleanQvacOutput(rawText);

  console.log("=================================");
  console.log("PARSING QVAC OUTPUT");
  console.log("Raw text length:", text.length);
  console.log("=================================");

  const parsed = extractJsonValue(text);

  // ----------------------------------------------------------
  // No valid JSON found
  // ----------------------------------------------------------

  if (!parsed) {
    console.log(
      "Could not parse QVAC output as JSON."
    );

    console.log("QVAC output was:");
    console.log(text);

    throw new Error(
      "QVAC returned incomplete or invalid quiz JSON."
    );
  }

  // ----------------------------------------------------------
  // CASE 1:
  // QVAC returned an array
  // ----------------------------------------------------------

  if (Array.isArray(parsed)) {
    console.log(
      "Direct JSON array parsed successfully."
    );

    return parsed;
  }

  // ----------------------------------------------------------
  // CASE 2:
  // QVAC returned:
  //
  // {
  //   "quiz": [...]
  // }
  // ----------------------------------------------------------

  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray(parsed.quiz)
  ) {
    console.log(
      "JSON quiz object parsed successfully."
    );

    return parsed.quiz;
  }

  // ----------------------------------------------------------
  // CASE 3:
  // QVAC returned ONE question object
  //
  // {
  //   "question": "...",
  //   "options": {...},
  //   "answer": "C",
  //   "explanation": "..."
  // }
  //
  // Convert it to an array so validation can handle it.
  // ----------------------------------------------------------

  if (
    parsed &&
    typeof parsed === "object" &&
    typeof parsed.question === "string" &&
    parsed.options &&
    typeof parsed.options === "object"
  ) {
    console.log(
      "QVAC returned a single question object."
    );

    console.log(
      "Converting single question object to array."
    );

    return [parsed];
  }

  // ----------------------------------------------------------
  // INVALID FORMAT
  // ----------------------------------------------------------

  console.log(
    "QVAC JSON was valid JSON but not a valid quiz structure."
  );

  console.log("Parsed value:");
  console.log(parsed);

  throw new Error(
    "QVAC returned invalid quiz JSON structure."
  );
}


// ============================================================
// VALIDATE QUESTIONS
// ============================================================

function validateQuestions(
  questions,
  expectedCount
) {

  if (!Array.isArray(questions)) {
    throw new Error(
      "Quiz result is not an array."
    );
  }

  if (questions.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} questions but received ${questions.length}.`
    );
  }

  for (let i = 0; i < questions.length; i++) {

    const q = questions[i];

    // --------------------------------------------------------
    // QUESTION OBJECT
    // --------------------------------------------------------

    if (!q || typeof q !== "object") {
      throw new Error(
        `Question ${i + 1} is invalid.`
      );
    }

    // --------------------------------------------------------
    // QUESTION TEXT
    // --------------------------------------------------------

    if (
      typeof q.question !== "string" ||
      !q.question.trim()
    ) {
      throw new Error(
        `Question ${i + 1} has no question text.`
      );
    }

    // --------------------------------------------------------
    // OPTIONS
    // --------------------------------------------------------

    if (
      !q.options ||
      typeof q.options !== "object"
    ) {
      throw new Error(
        `Question ${i + 1} has no options.`
      );
    }

    const requiredOptions = [
      "A",
      "B",
      "C",
      "D"
    ];

    for (const letter of requiredOptions) {

      if (
        typeof q.options[letter] !== "string" ||
        !q.options[letter].trim()
      ) {
        throw new Error(
          `Question ${i + 1} is missing option ${letter}.`
        );
      }
    }

    // --------------------------------------------------------
    // ANSWER
    // --------------------------------------------------------

    if (
      !["A", "B", "C", "D"].includes(q.answer)
    ) {
      throw new Error(
        `Question ${i + 1} has invalid answer: ${q.answer}`
      );
    }

    // --------------------------------------------------------
    // EXPLANATION
    // --------------------------------------------------------

    if (
      typeof q.explanation !== "string"
    ) {
      throw new Error(
        `Question ${i + 1} has invalid explanation.`
      );
    }
  }

  console.log(
    `Validation successful: ${questions.length} questions.`
  );

  return true;
}


// ============================================================
// BUILD QUIZ PROMPT
// ============================================================

function buildQuizPrompt(
  topic,
  count,
  difficulty,
  retryAttempt = 1
) {

  let retryInstruction = "";

  if (retryAttempt > 1) {
    retryInstruction = `
IMPORTANT RETRY INSTRUCTION:

Your previous response did not contain exactly ${count} questions.

This time you MUST return exactly ${count} complete question objects.

DO NOT return only one question.

DO NOT stop early.

DO NOT return an individual JSON object.

The response MUST start with [ and end with ].
`;
  }

  return `
Generate exactly ${count} multiple-choice quiz questions.

Topic: ${topic}
Difficulty: ${difficulty}

${retryInstruction}

RETURN ONLY JSON.

NO Markdown.
NO code fences.
NO introduction.
NO text before the JSON.
NO text after the JSON.

The response MUST be a JSON ARRAY.

Use EXACTLY this structure:

[
  {
    "question": "Short question",
    "options": {
      "A": "Short answer",
      "B": "Short answer",
      "C": "Short answer",
      "D": "Short answer"
    },
    "answer": "A",
    "explanation": "Short explanation"
  }
]

STRICT RULES:

- Return exactly ${count} question objects.
- The top-level JSON value MUST be an array.
- The array MUST contain exactly ${count} objects.
- Each question must be different.
- Each question must be about ${topic}.
- Each question must have exactly 4 options.
- Option keys MUST be A, B, C, D.
- The answer MUST be only A, B, C, or D.
- The explanation MUST be very short.
- Keep questions short.
- Keep options short.
- Do NOT number the questions.
- Do NOT put numbering inside options.
- Do NOT repeat the question as an option.
- Do NOT add comments.
- Do NOT add Markdown.
- Do NOT add extra text.
- Make sure every JSON string is properly closed.
- Make sure every object is properly closed.
- Make sure the array is properly closed.
- End the response with the closing ].

FINAL REMINDER:

Return exactly ${count} questions.

BEGIN JSON:
`;
}


// ============================================================
// GENERATE ONE BATCH
// ============================================================

async function generateBatch(
  loadedModelId,
  topic,
  count,
  difficulty,
  batchNumber,
  totalBatches
) {

  const MAX_ATTEMPTS = 3;

  let lastError = null;

  // ----------------------------------------------------------
  // RETRY LOOP
  // ----------------------------------------------------------

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt++
  ) {

    console.log("=================================");
    console.log(
      `QVAC BATCH ${batchNumber}/${totalBatches}`
    );
    console.log(
      `Attempt ${attempt}/${MAX_ATTEMPTS}`
    );
    console.log("Questions:", count);
    console.log("Topic:", topic);
    console.log("Difficulty:", difficulty);
    console.log("=================================");

    try {

      // ------------------------------------------------------
      // BUILD PROMPT
      // ------------------------------------------------------

      const prompt = buildQuizPrompt(
        topic,
        count,
        difficulty,
        attempt
      );

      console.log(
        "Sending completion request to QVAC..."
      );

      // ------------------------------------------------------
      // QVAC COMPLETION
      // ------------------------------------------------------

      const result = completion({
        modelId: loadedModelId,

        history: [
          {
            role: "user",
            content: prompt
          }
        ],

        stream: true
      });

      let output = "";

      console.log(
        "Receiving QVAC tokens..."
      );

      for await (
        const token of result.tokenStream
      ) {
        output += token;
      }

      // ------------------------------------------------------
      // SHOW RAW OUTPUT
      // ------------------------------------------------------

      console.log("=================================");
      console.log(
        `RAW BATCH ${batchNumber} OUTPUT:`
      );
      console.log(output);
      console.log("=================================");

      // ------------------------------------------------------
      // EMPTY OUTPUT
      // ------------------------------------------------------

      if (!output.trim()) {
        throw new Error(
          `QVAC returned empty output for batch ${batchNumber}.`
        );
      }

      // ------------------------------------------------------
      // PARSE JSON
      // ------------------------------------------------------

      const questions =
        extractJsonArray(output);

      console.log(
        `Batch ${batchNumber} produced ${questions.length} questions.`
      );

      // ------------------------------------------------------
      // VALIDATE COUNT + STRUCTURE
      // ------------------------------------------------------

      validateQuestions(
        questions,
        count
      );

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      console.log("=================================");
      console.log(
        `BATCH ${batchNumber} SUCCESS`
      );
      console.log("=================================");

      return questions;

    } catch (error) {

      lastError = error;

      console.error("=================================");
      console.error(
        `BATCH ${batchNumber} ATTEMPT ${attempt} FAILED`
      );
      console.error("Error:", error?.message);
      console.error("=================================");

      // ------------------------------------------------------
      // RETRY
      // ------------------------------------------------------

      if (attempt < MAX_ATTEMPTS) {

        console.log(
          `Retrying batch ${batchNumber}...`
        );

        // Small delay before retry
        await new Promise(
          resolve => setTimeout(resolve, 1000)
        );

        continue;
      }

      // ------------------------------------------------------
      // ALL ATTEMPTS FAILED
      // ------------------------------------------------------

      console.error(
        `Batch ${batchNumber} failed after ${MAX_ATTEMPTS} attempts.`
      );

      throw lastError;
    }
  }

  throw lastError;
}


// ============================================================
// GENERATE QUIZ
// ============================================================

export async function generateQuiz(
  topic,
  count,
  difficulty
) {

  console.log("=================================");
  console.log("QVAC: Starting quiz generation");
  console.log("Topic:", topic);
  console.log("Count:", count);
  console.log("Difficulty:", difficulty);
  console.log("=================================");

  try {

    // --------------------------------------------------------
    // LOAD MODEL
    // --------------------------------------------------------

    const loadedModelId =
      await ensureModelLoaded();

    // --------------------------------------------------------
    // NORMALIZE COUNT
    // --------------------------------------------------------

    const requestedCount =
      Math.max(
        1,
        Math.min(
          20,
          Number(count) || 5
        )
      );

    console.log(
      "Normalized question count:",
      requestedCount
    );

    // --------------------------------------------------------
    // BATCH SIZE
    //
    // Keep this at 2 because the 1B model can truncate
    // longer responses.
    // --------------------------------------------------------

    const batchSize = 2;

    const totalBatches =
      Math.ceil(
        requestedCount / batchSize
      );

    console.log(
      "Batch size:",
      batchSize
    );

    console.log(
      "Total batches:",
      totalBatches
    );

    // --------------------------------------------------------
    // STORAGE
    // --------------------------------------------------------

    let allQuestions = [];

    // --------------------------------------------------------
    // GENERATE EACH BATCH
    // --------------------------------------------------------

    for (
      let batch = 1;
      batch <= totalBatches;
      batch++
    ) {

      const remaining =
        requestedCount -
        allQuestions.length;

      const currentBatchSize =
        Math.min(
          batchSize,
          remaining
        );

      console.log("=================================");
      console.log(
        `Preparing batch ${batch}/${totalBatches}`
      );
      console.log(
        "Remaining questions:",
        remaining
      );
      console.log(
        "Current batch size:",
        currentBatchSize
      );
      console.log("=================================");

      const batchQuestions =
        await generateBatch(
          loadedModelId,
          topic,
          currentBatchSize,
          difficulty,
          batch,
          totalBatches
        );

      // ------------------------------------------------------
      // ADD QUESTIONS
      // ------------------------------------------------------

      allQuestions.push(
        ...batchQuestions
      );

      console.log(
        `Total questions collected: ${allQuestions.length}/${requestedCount}`
      );
    }

    // --------------------------------------------------------
    // FINAL SLICE
    // --------------------------------------------------------

    allQuestions =
      allQuestions.slice(
        0,
        requestedCount
      );

    // --------------------------------------------------------
    // FINAL VALIDATION
    // --------------------------------------------------------

    validateQuestions(
      allQuestions,
      requestedCount
    );

    // --------------------------------------------------------
    // FINAL SUCCESS
    // --------------------------------------------------------

    console.log("=================================");
    console.log(
      "QVAC QUIZ GENERATION COMPLETE"
    );
    console.log(
      "Final question count:",
      allQuestions.length
    );
    console.log("=================================");

    // --------------------------------------------------------
    // RETURN JSON STRING TO ELECTRON
    // --------------------------------------------------------

    return JSON.stringify(
      allQuestions
    );

  } catch (error) {

    console.error("=================================");
    console.error(
      "QVAC GENERATION FAILED"
    );
    console.error("=================================");

    console.error(
      "Error:",
      error
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Name:",
      error?.name
    );

    console.error(
      "Stack:",
      error?.stack
    );

    throw error;
  }
}


// ============================================================
// CLOSE / UNLOAD MODEL
// ============================================================

export async function closeModel() {

  console.log("=================================");
  console.log("QVAC: Closing model...");
  console.log("=================================");

  if (!modelId) {

    console.log(
      "No QVAC model currently loaded."
    );

    return;
  }

  try {

    await unloadModel({
      modelId,
      autoClose: true
    });

    console.log(
      "QVAC model unloaded successfully."
    );

  } catch (error) {

    console.error(
      "Error unloading QVAC model:",
      error
    );

  } finally {

    modelId = null;
  }
}

