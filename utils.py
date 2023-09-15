import json

def load_json_from_file(file_path):
    try:
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
        return data
    except FileNotFoundError:
        return None

def save_text_to_file(data, file_path):
    try:
        with open(file_path, 'w') as file:
            file.write(data)
        return True
    except Exception as e:
        print(f"Error saving JSON data: {str(e)}")
        return False

def load_text_from_file(file_path):
    try:
        with open(file_path, 'r') as file:
            data = file.read()
        return data
    except FileNotFoundError:
        return None

def save_json_to_file(data, file_path):
    try:
        with open(file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        return True
    except Exception as e:
        print(f"Error saving JSON data: {str(e)}")
        return False
    