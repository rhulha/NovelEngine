import os, json, openai
from flask import Flask, render_template, jsonify, request
from dotenv import dotenv_values
from utils import load_json_from_file, save_text_to_file, load_text_from_file

config = dotenv_values(".env")
openai.api_key = config["API_KEY"]

app = Flask(__name__)

if not os.path.exists("data"):
    os.makedirs("data")
    
@app.route('/api/items', methods=['GET'])
def get_items():
    tree_data = load_json_from_file("tree_data.json")
    return jsonify(tree_data)

@app.route('/api/load/<path:path>', methods=['POST'])
def load(path):
    if request.method == 'POST':
        # todo urldecode path
        path = path.replace("%20", " ")
        filename = "data/" + path.replace("/", "_") + ".txt"
        if not os.path.exists(filename):
            return ""
        return load_text_from_file(filename)

@app.route('/api/save/<path:path>', methods=['POST'])
def save(path):
    if request.method == 'POST':
        text = request.data.decode('utf-8')
        path = path.replace("%20", " ")
        save_text_to_file(text, "data/" + path.replace("/", "_") + ".txt")
        return "success"

# request.args.get('prompt')
@app.route('/api/generate', methods=['POST'])
def generate():
    if request.method == 'POST':
        prompt = request.data.decode('utf-8')
        response = openai.ChatCompletion.create(model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0,
        )
        return response['choices'][0]['message']['content']

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
