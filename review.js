import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const folder = path.join(process.cwd(), "json");

async function sortAndDeduplicateKeepFirst() {
  try {
    const files = await readdir(folder);

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(folder, file);

        const data = await readFile(filePath, "utf-8");
        let jsonArray = JSON.parse(data);

        if (Array.isArray(jsonArray)) {
          // Keep only the first occurrence of each "en"
          const seen = new Set();
          jsonArray = jsonArray.filter((item) => {
            const word = item.en?.toLowerCase();
            if (!word || seen.has(word)) return false;
            seen.add(word);
            return true;
          });

          // Sort alphabetically
          jsonArray.sort((a, b) =>
            a.en.toLowerCase().localeCompare(b.en.toLowerCase())
          );

          // Save back
          await writeFile(
            filePath,
            JSON.stringify(jsonArray, null, 2),
            "utf-8"
          );

          console.log(`✅ Processed: ${file} (sorted + kept first occurrence of duplicates)`);
        } else {
          console.warn(`⚠️ Skipping ${file}, not an array`);
        }
      }
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

sortAndDeduplicateKeepFirst();

