import fs from "fs";
import path from "path";
import textToSpeech from "@google-cloud/text-to-speech";

// Create Google TTS client
const client = new textToSpeech.TextToSpeechClient();

// Path to the JSON file
const wordsFile = "json/word_300.json";
const outputDir = "audios";

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateAudio() {
  // Load words
  const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

  for (const { en, audio } of words) {
    const filePath = path.join(outputDir, audio);

    // ✅ Skip if file already exists
    if (fs.existsSync(filePath)) {
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