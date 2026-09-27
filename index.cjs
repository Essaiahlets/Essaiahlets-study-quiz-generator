const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");
let mainWindow = null;
let qvacModule = null;
// ==========================================
// CREATE WINDOW
// ==========================================
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile(
    path.join(__dirname, "index.html")
  );
  // Open DevTools automatically
  mainWindow.webContents.openDevTools();
}
// ==========================================
// PARSE QVAC JSON
// ==========================================
function parseQuiz(rawText) {
  console.log("Parsing QVAC output...");
  let text = String(rawText || "").trim();
  // Remove markdown code fences if model accidentally adds them
  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  // Try direct JSON parse
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (
      parsed &&
      Array.isArray(parsed.quiz)
    ) {
      return parsed.quiz;
    }
  } catch (error) {
    console.log(
      "Direct JSON parse failed."
    );
  }
  // Find JSON array inside extra text
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (
    start !== -1 &&
    end !== -1 &&
    end > start
  ) {
    const possibleJson =
      text.substring(
        start,
        end + 1
      );
    try {
      const parsed =
        JSON.parse(possibleJson);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.log(
        "Extracted JSON parse failed."
      );
    }
  }
  throw new Error(
    "QVAC returned text, but it was not valid quiz JSON."
  );
}
// ==========================================
// NORMALIZE QUIZ
// ==========================================
function normalizeQuiz(quiz) {
  if (!Array.isArray(quiz)) {
    return [];
  }
  return quiz
    .map((item) => {
      if (
        !item ||
        !item.question
      ) {
        return null;
      }
      let options =
        item.options;
      // If options are returned as an array
      if (Array.isArray(options)) {
        const converted = {};
        options
          .slice(0, 4)
          .forEach(
            (option, index) => {
              const letter =
                String.fromCharCode(
                  65 + index
                );
              converted[letter] =
                option;
            }
          );
        options = converted;
      }
      if (
        !options ||
        typeof options !==
          "object"
      ) {
        return null;
      }
      const normalizedOptions = {
        A: options.A ?? "",
        B: options.B ?? "",
        C: options.C ?? "",
        D: options.D ?? ""
      };
      let answer =
        item.answer;
      // Sometimes model returns "Option A"
      if (
        typeof answer ===
        "string"
      ) {
        answer =
          answer
            .trim()
            .toUpperCase();
        if (
          answer.includes("A")
        ) {
          answer = "A";
        } else if (
          answer.includes("B")
        ) {
          answer = "B";
        } else if (
          answer.includes("C")
        ) {
          answer = "C";
        } else if (
          answer.includes("D")
        ) {
          answer = "D";
        }
      }
      if (
        ![
          "A",
          "B",
          "C",
          "D"
        ].includes(answer)
      ) {
        answer = "A";
      }
      return {
        question:
          String(
            item.question
          ),
        options:
          normalizedOptions,
        answer,
        explanation:
          String(
            item.explanation || ""
          )
      };
    })
    .filter(Boolean);
}
// ==========================================
// QVAC IPC HANDLER
// ==========================================
ipcMain.handle(
  "generate-quiz",
  async (
    event,
    {
      topic,
      count,
      difficulty
    }
  ) => {
    console.log(
      "================================="
    );
    console.log(
      "IPC: generate-quiz received"
    );
    console.log(
      "Topic:",
      topic
    );
    console.log(
      "Count:",
      count
    );
    console.log(
      "Difficulty:",
      difficulty
    );
    console.log(
      "================================="
    );
    try {
      // ==========================================
      // LOAD QVAC APP.JS ONLY ONCE
      // ==========================================
      if (!qvacModule) {
        console.log(
          "Importing QVAC app.js..."
        );
        const appJsPath =
          path.join(
            __dirname,
            "app.js"
          );
        console.log(
          "app.js path:",
          appJsPath
        );
        // IMPORTANT:
        // Windows absolute paths such as
        // C:\Users\...
        // must be converted into a file:// URL
        // before using dynamic import().
        const appJsUrl =
          pathToFileURL(
            appJsPath
          ).href;
        console.log(
          "app.js file URL:",
          appJsUrl
        );
        qvacModule =
          await import(
            appJsUrl
          );
        console.log(
          "QVAC app.js imported!"
        );
        console.log(
          "Available QVAC exports:",
          Object.keys(
            qvacModule
          )
        );
      }
      // ==========================================
      // GENERATE RAW TEXT
      // ==========================================
      if (
        typeof qvacModule.generateQuiz !==
        "function"
      ) {
        throw new Error(
          "app.js does not export a generateQuiz() function."
        );
      }
      console.log(
        "Calling QVAC generateQuiz()..."
      );
      const rawText =
        await qvacModule.generateQuiz(
          topic,
          Number(count),
          difficulty
        );
      console.log(
        "Raw QVAC result received."
      );
      console.log(
        "Raw result:",
        rawText
      );
      // ==========================================
      // PARSE JSON
      // ==========================================
      const parsedQuiz =
        parseQuiz(
          rawText
        );
      // ==========================================
      // NORMALIZE
      // ==========================================
      const quiz =
        normalizeQuiz(
          parsedQuiz
        );
      console.log(
        "Final quiz count:",
        quiz.length
      );
      if (
        !quiz.length
      ) {
        throw new Error(
          "QVAC generated text, but no valid quiz questions were found."
        );
      }
      console.log(
        "Quiz successfully generated!"
      );
      return {
        success: true,
        quiz
      };
    } catch (error) {
      console.error(
        "================================="
      );
      console.error(
        "GENERATE QUIZ ERROR:"
      );
      console.error(
        error
      );
      console.error(
        "================================="
      );
      return {
        success: false,
        error:
          error.message ||
          String(error),
        quiz: []
      };
    }
  }
);
// ==========================================
// APP READY
// ==========================================
app.whenReady().then(() => {
  createWindow();
});
// ==========================================
// CLOSE
// ==========================================
app.on(
  "window-all-closed",
  async () => {
    if (
      qvacModule?.closeModel
    ) {
      try {
        await qvacModule.closeModel();
      } catch (error) {
        console.error(
          "Model close error:",
          error
        );
      }
    }
    if (
      process.platform !==
      "darwin"
    ) {
      app.quit();
    }
  }
);
// ==========================================
// ACTIVATE
// ==========================================
app.on(
  "activate",
  () => {
    if (
      BrowserWindow
        .getAllWindows()
        .length === 0
    ) {
      createWindow();
    }
  }
);