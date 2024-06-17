from flask import Flask, request, jsonify
from flask_cors import CORS
from generate_questions import generate_questions
import re
import json

app = Flask(__name__)
CORS(app, resources={r"/generate-questions": {"origins": "https://uw-kids.vercel.app"}})

def clean_json_response(response_text):
    # Extract the JSON array from the response
    match = re.search(r'\[\s*(\{(?:[^{}]|\{[^{}]*\})*\}\s*,?\s*)+\s*\]', response_text, re.DOTALL)
    if match:
        return match.group(0)
    else:
        raise ValueError("No valid JSON array found")

def validate_question_structure(question):
    if not isinstance(question, dict):
        return False
    required_keys = {'question', 'options', 'answer'}
    if not required_keys.issubset(question.keys()):
        return False
    if not isinstance(question['question'], str):
        return False
    if not isinstance(question['options'], list) or len(question['options']) != 4:
        return False
    if not all(isinstance(option, dict) and 'text' in option and 'value' in option for option in question['options']):
        return False
    if not isinstance(question['answer'], int) or question['answer'] not in {1, 2, 3, 4}:
        return False
    return True

@app.route('/generate-questions', methods=['POST'])
def generate_question():
    data = request.json
    subject = data.get('subject')
    difficulty = data.get('difficulty')
    max_difficulty = data.get('maxDifficulty')
    number_questions = data.get('numberQuestions')
    max_attempts = 5
    attempt = 0
    
    while attempt < max_attempts:

        questions = generate_questions(subject, difficulty, max_difficulty, number_questions)

        try:
            print(questions)
            cleaned_response = clean_json_response(questions)
            print(cleaned_response)
            questions = json.loads(cleaned_response)
            if isinstance(questions, list) and len(questions) == number_questions and all(validate_question_structure(q) for q in questions):
                return jsonify(questions), 200
        except (ValueError, TypeError) as e:
            attempt += 1

    return jsonify({"error": "Failed to generate valid questions after multiple attempts"}), 500

if __name__ == '__main__':
    app.run(debug=True)
