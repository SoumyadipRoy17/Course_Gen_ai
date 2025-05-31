import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output_gemini } from "./gpt";

export async function searchYoutube(searchQuery) {
  // hello world => hello+world
  searchQuery = encodeURIComponent(searchQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
  );
  if (!data) {
    console.log("youtube fail");
    return null;
  }
  if (data.items[0] === undefined) {
    console.log("youtube fail");
    return null;
  }
  return data.items[0].id.videoId;
}

export async function getTranscript(videoId) {
  try {
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      country: "EN",
    });
    let transcript = "";
    for (let t of transcriptArr) {
      transcript += t.text + " ";
    }
    return transcript.replace(/\n/g, "");
  } catch (error) {
    return "";
  }
}

export async function getQuestionsFromTranscript(transcript, courseTitle) {
  const questions = await strict_output_gemini(
    "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words",
    new Array(5).fill(
      `You are to generate a random hard mcq question about ${courseTitle} with context of the following transcript: ${transcript}`
    ),
    {
      question: "question",
      answer: "answer with max length of 15 words",
      option1: "option1 with max length of 15 words",
      option2: "option2 with max length of 15 words",
      option3: "option3 with max length of 15 words",
    }
  );
  return questions;
}
