
import { generateSmartBlog } from '../lib/ai/smart-generator';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function testGeneration() {
  console.log("Starting Test Generation...");
  try {
    const blog = await generateSmartBlog(
      "The Future of Artificial Intelligence",
      ["AI Evolution", "Neural Networks 101"],
      "Technology",
      ["https://xylosai.vercel.app/blog/ai-ethics"],
      ["https://openai.com/blog"]
    );
    
    console.log("Title:", blog.title);
    console.log("Word count approx:", blog.content.split(' ').length);
    console.log("JSON Parsing: SUCCESS");
  } catch (err: any) {
    console.error("Generation FAILED:", err.message);
  }
}

testGeneration();
