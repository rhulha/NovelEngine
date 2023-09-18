const fs = require('fs');
const path = require('path');
const express = require("express");
const OpenAI = require('openai');
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/api/items", (request, response) => {
  fs.readFile("./tree_data.json", "utf8", (err, tree_data) => {
    if (err) {
      console.log("File read failed:", err);
      response.status(500).send('Internal Server Error');
      return;
    }
    response.send(tree_data);
  });
});

app.get('/api/load/:path(*)', (req, res) => {
  const pathParam = req.params.path;
  console.log(pathParam);
  //  decodeURIComponent(
  const decodedPath = pathParam.replace(/%20/g, ' ');
  const filename = path.join(__dirname, 'data', decodedPath.replace(/\//g, '_') + '.txt');
  if (!fs.existsSync(filename)) {
    res.send('');
  } else {
    res.send(fs.readFileSync(filename, 'utf8'));
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { openai_api_key, prompt } = req.body;
    const openai = new OpenAI({apiKey: openai_api_key});
    const completion = await openai.chat.completions.create({
      messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
      model: 'gpt-4',
    });
    res.send(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
