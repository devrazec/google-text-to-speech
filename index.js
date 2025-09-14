import fs from "fs";
import path from "path";
import textToSpeech from "@google-cloud/text-to-speech";

// Create Google TTS client
const client = new textToSpeech.TextToSpeechClient();

// Path to the JSON file
const wordsFile = "json/word_100.json";
const outputDir = "audios";

// Ensure output folder exists
await fs.promises.mkdir(outputDir, { recursive: true });

// Helper to sanitize words into safe filenames
function sanitizeFileName(word) {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // replace non-alphanumeric chars with "_"
    .replace(/^_+|_+$/g, "")     // trim leading/trailing "_"
    + ".mp3";
}

// Check if file exists
async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function generateAudio() {
  // Load words
  const words = JSON.parse(await fs.promises.readFile(wordsFile, "utf8"));

  for (const { en } of words) {
    const fileName = sanitizeFileName(en);
    const filePath = path.join(outputDir, fileName);

    if (await fileExists(filePath)) {
      console.log(`⏭️ Skipped (already exists): ${filePath}`);
      continue;
    }

    try {
      const request = {
        input: { text: en },
        voice: { languageCode: "en-US", name: "en-US-Chirp3-HD-Aoede" },
        audioConfig: { audioEncoding: "MP3" },
      };

      const [response] = await client.synthesizeSpeech(request);

      await fs.promises.writeFile(filePath, response.audioContent, "binary");
      console.log(`✅ Created: ${filePath}`);
    } catch (err) {
      console.error(`❌ Error creating audio for "${en}":`, err);
    }
  }
}

generateAudio();