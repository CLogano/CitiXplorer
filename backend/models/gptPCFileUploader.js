const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
require('dotenv').config({ path: require("path").resolve(__dirname, "../.env") })

const config = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(config);


async function upload() {

    try {

      const response = await openai.createFile(
        fs.createReadStream("./gptPCdata_prepared.jsonl"),
        'fine-tune'
      );
      console.log("File ID: ", response.data.id);
      fs.writeFileSync("./fileId.js", `export const fileId = "${response.data.id}"`);

    } catch (error) {
      console.error(error);
    }
}

upload();