import fs from "fs";
import path from "path";
import textToSpeech from "@google-cloud/text-to-speech";

// Google TTS client
const client = new textToSpeech.TextToSpeechClient();

// Paths
const wordsFile = "json/word_100.json";
const outputDir = "audios";

// Ensure output folder exists
await fs.promises.mkdir(outputDir, { recursive: true });

// Helper: sanitize word to safe filename
function sanitizeFileName(word) {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    + ".mp3";
}

// Helper: check if file exists
async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Generate audio for all words sequentially
async function generateAudio() {
  const rawData = await fs.promises.readFile(wordsFile, "utf8");
  const words = JSON.parse(rawData);
  console.log(`📄 Loaded ${words.length} words from ${wordsFile}`);

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

  console.log("🎯 All words processed.");
}

// Run the generator
generateAudio();