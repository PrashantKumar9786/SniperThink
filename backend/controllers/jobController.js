const { Job, Result } = require("../models");

exports.getJobStatus = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobResult = async (req, res) => {
  try {
    const result = await Result.findOne({ where: { job_id: req.params.id } });
    if (!result) return res.status(404).json({ error: "Result not ready yet" });

    res.json({
      jobId: parseInt(req.params.id),
      wordCount: result.word_count,
      paragraphCount: result.paragraph_count,
      topKeywords: result.keywords,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerInterest = async (req, res) => {
  try {
    const { name, email, selectedStep } = req.body;
    if (!name || !email || !selectedStep) {
      return res
        .status(400)
        .json({ error: "name, email and selectedStep are required" });
    }
    console.log(`💡 Interest: ${name} (${email}) → ${selectedStep}`);
    res.json({ message: "Interest registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
