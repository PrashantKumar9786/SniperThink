require("dotenv").config();
const fs = require("fs");
const path = require("path");
const PDFParser = require("pdf2json");
const sequelize = require("../config/db");
const { Job, Result } = require("../models");
const fileQueue = require("../services/queueService");

// Connect DB
sequelize
  .authenticate()
  .then(() => console.log("✅ Worker DB connected"))
  .catch((err) => {
    console.error("❌ Worker DB error:", err.message);
    process.exit(1);
  });

// Extract text from PDF
function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(new Error(err.parserError));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const raw = pdfParser.getRawTextContent();
      // Normalize line endings and replace page break markers with double newlines
      const cleaned = raw
        .replace(/\r\n/g, "\n")
        .replace(/----------------Page \(\d+\) Break----------------/g, "\n\n")
        .trim();
      resolve(cleaned);
    });

    pdfParser.loadPDF(filePath);
  });
}

// Extract text — handles both PDF and TXT
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") {
    return await extractTextFromPDF(filePath);
  }
  return fs.readFileSync(filePath, "utf-8");
}

// Get top 5 keywords
function getTopKeywords(text, topN = 5) {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "is",
    "it",
    "this",
    "that",
    "was",
    "with",
    "as",
    "by",
    "from",
    "be",
    "are",
    "have",
    "has",
    "had",
    "not",
    "we",
    "you",
    "i",
    "he",
    "she",
    "they",
    "all",
    "can",
    "its",
    "our",
    "your",
    "their",
    "will",
    "one",
    "new",
    "also",
    "more",
    "about",
    "who",
    "what",
    "when",
    "how",
    "which",
    "do",
    "my",
    "me",
    "if",
    "so",
    "up",
    "out",
    "would",
    "could",
    "should",
    "just",
  ]);
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const freq = {};
  words.forEach((w) => {
    if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

// Smart paragraph counter — works for both PDF and TXT
function countParagraphs(text) {
  // Method 1: double newlines (works well after PDF cleaning)
  const byDoubleNewline = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 10);
  if (byDoubleNewline.length > 1) {
    return byDoubleNewline.length;
  }

  // Method 2: lines starting with "==>" heading markers
  const byHeadings = text.split(/==>/).filter((p) => p.trim().length > 0);
  if (byHeadings.length > 1) {
    return byHeadings.length;
  }

  // Method 3: count substantial lines (length > 30) as paragraph indicators
  const byLines = text.split("\n").filter((line) => line.trim().length > 30);
  if (byLines.length > 0) {
    return byLines.length;
  }

  return 1;
}

// Process up to 3 jobs concurrently
fileQueue.process(3, async (bullJob) => {
  const { jobId, filePath } = bullJob.data;
  console.log(`⚙️  Processing job ${jobId} — file: ${filePath}`);

  try {
    // Step 1 — mark processing
    await Job.update(
      { status: "processing", progress: 10 },
      { where: { id: jobId } },
    );
    await bullJob.progress(10);

    // Step 2 — extract text
    const text = await extractText(filePath);
    console.log(`📝 Extracted ${text.length} characters`);
    await Job.update({ progress: 50 }, { where: { id: jobId } });
    await bullJob.progress(50);

    // Step 3 — analyze
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const paragraphCount = countParagraphs(text);
    const topKeywords = getTopKeywords(text);

    console.log(
      `📊 Job ${jobId}: ${wordCount} words, ${paragraphCount} paragraphs, keywords: [${topKeywords}]`,
    );
    await Job.update({ progress: 80 }, { where: { id: jobId } });
    await bullJob.progress(80);

    // Step 4 — save results
    await Result.create({
      job_id: jobId,
      word_count: wordCount,
      paragraph_count: paragraphCount,
      keywords: topKeywords,
    });

    // Step 5 — mark completed
    await Job.update(
      { status: "completed", progress: 100 },
      { where: { id: jobId } },
    );
    await bullJob.progress(100);
    console.log(`✅ Job ${jobId} completed successfully!`);
  } catch (err) {
    console.error(`❌ Job ${jobId} failed:`, err.message);
    await Job.update({ status: "failed" }, { where: { id: jobId } });
    throw err;
  }
});

fileQueue.on("failed", (job, err) => {
  console.error(`💀 Job ${job.data.jobId} permanently failed:`, err.message);
});

console.log("🔧 Worker started — waiting for jobs...");
