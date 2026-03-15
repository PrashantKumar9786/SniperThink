const { User, File, Job } = require("../models");
const fileQueue = require("../services/queueService");

exports.uploadFile = async (req, res) => {
  try {
    console.log("📥 Upload request received");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Find or create user
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { name, email },
    });
    console.log("👤 User:", user.id);

    // Save file record
    const file = await File.create({
      user_id: user.id,
      file_path: req.file.path,
    });
    console.log("📄 File saved:", file.id);

    // Create job with pending status
    const job = await Job.create({
      file_id: file.id,
      status: "pending",
      progress: 0,
    });
    console.log("📋 Job created:", job.id);

    // Push to Bull queue
    await fileQueue.add({ jobId: job.id, filePath: req.file.path });
    console.log("📨 Job pushed to queue");

    res.json({
      message: "File uploaded successfully",
      jobId: job.id,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};
