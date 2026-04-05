import fs from "fs";
import path from "path";
import textToSpeech from "@google-cloud/text-to-speech";
import * as XLSX from 'xlsx';

// Google TTS client
const client = new textToSpeech.TextToSpeechClient();

// Paths
const xlsxPath = "xlsx/828_Answer.xlsx";
const outputDir = "mp3/answer";

// Ensure output folder exists
await fs.promises.mkdir(outputDir, { recursive: true });

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

  const workbook = XLSX.read(fs.readFileSync(xlsxPath));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  console.log(`📄 Loaded ${jsonData.length} words from ${xlsxPath}`);

  for (const row of jsonData) {
    const fileName = row["mp3"];
    const en = row["name"];
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
await generateAudio();