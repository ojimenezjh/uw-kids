import os
import dotenv
import json

#from src.DBManager import DBManager

#ChatGPT
from langchain import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate, AIMessagePromptTemplate

def generate_questions(subject, difficulty, max_difficulty, number_questions):

	dotenv.load_dotenv()

	OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY")
	MODEL_NAME=os.environ.get("OPENAI_MODEL")
	
	if not OPENAI_API_KEY:
		raise ValueError("API key not found")
	
	try:
 
		# dbManager = DBManager()

		# Create an llm
		llm_openai = ChatOpenAI(model_name = MODEL_NAME, openai_api_key=OPENAI_API_KEY)

		# dbManager.insert(answer)
		prompt_template = """
			You are a question generator in JSON about {subject}. You have to give me 4 possible answers and tell me which one is correct. You have to generate a question with a difficulty of {difficulty}/{max_difficulty}. Your answer must follow the following format:
			{{
				"question": "Type the question here",
				"options": [
					{{"value": 1, "text": "Option 1"}},
					{{"value": 2, "text": "Option 2"}},
					{{"value": 3, "text": "Option 3"}},
					{{"value": 4, "text": "Option 4"}}
				],
				"answer": "Value of the correct answer"
			}}
			You must generate the content following these rules:
			1. You must ensure that the content does not contain strong or inappropriate language, sexual references, violence, political content, references to drugs or alcohol, horror content, disturbing themes, or content that promotes any kind of hate.
			2. You must only provide the generated JSON array and nothing else, you don't need to explain it.
			3. It must be in JSON array format to be inserted into a MongoDB.
			4. You must write the content of each JSON tag in Spanish. Do not translate the keys, only the values of the JSON.
			5. You must generate {number_questions} questions.
			6. You must generate questions with a difficulty of {difficulty}/{max_difficulty}.
			7. Make sure each question is unique and does not repeat any of the previous questions.
		"""
		
		prompt_temp_sistema = PromptTemplate(
			template=prompt_template,
			input_variables=["subject", "difficulty", "max_difficulty", "number_questions"],
		)

		template_sistema = SystemMessagePromptTemplate(prompt=prompt_temp_sistema)

		chat_prompt = ChatPromptTemplate.from_messages([template_sistema])
		chat_promt_value = chat_prompt.format_prompt(subject=subject, difficulty=difficulty, max_difficulty=max_difficulty, number_questions=number_questions).to_messages()
		chat_resp = llm_openai(chat_promt_value)

		print(chat_resp.content)

		return json.loads(chat_resp.content)

	except Exception as e:
		print(f"Error occurred: {e}")
		return {}