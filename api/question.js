const express = require("express");
const { getTranscript } = require("youtube-transcript-api");
const { generateText } = require("../services/groqServices");
const { extractVideoId } = require("../helpers/extractVideoId");

const router = express.Router();

router.post("/question", async (req, res) => {
  const { message, videoUrl } = req.body;

  console.log("Received question:", message);

  try {
    const videoId = extractVideoId(videoUrl);
    const transcript = await getTranscript(videoId, { timeout: 60000 });
    const transcriptText = transcript.map((entry) => entry.text).join(" ");

    const prompt = `Answer the following question: ${message} from the youtube url ${videoUrl} and having transcript ${transcriptText} also response should be like a bot user should not know that you know the transcript and videoUrl `;
    const answer = await generateText("llama3-8b-8192", prompt);

    console.log(answer);
    res.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Error generating answer:", error.message);
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

module.exports = router;
