from flask import Flask, request, jsonify
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from flask_cors import CORS
import os
import time
import openai
import sqlite3
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

#==================================
from PyPDF2 import PdfReader
# from langchain_community.embeddings.openai import OpenAIEmbeddings
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.chains.question_answering import load_qa_chain
# from langchain_community.llms.openai import OpenAI
from langchain.llms.openai import OpenAI
#==================================

os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
secretKey = os.environ.get("OPENAI_API_KEY")
openai.api_key=secretKey

app = Flask(__name__)
CORS(app)

def get_gemini_response(question, prompt):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content([prompt[0], question])
    return response.text

def read_sql_query(response, db):
    queries = response.split(';')
    
    queries = [query.strip() for query in queries if query.strip()]
    
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    
    results = []
    for query in queries:
        cur.execute(query)
        rows = cur.fetchall()
        conn.commit()
        results.append(rows)
    
    conn.close()
    for result in results:
        for row in result:
            print(row)
    
    return results

chat_history=[]

def genai_chat_send(question):
    secure_chat = "hey voice gpt"
    prompt = [
            """
                You are an expert in converting English questions to SQL query!
                The SQL database has the name USER and has the following columns - NAME, BALANCE, USERID \n\n For example,\n
                Example 1 - How many entries of records are present?, 
                the SQL command will be something like this SELECT COUNT(*) FROM USER;\n
                Example 2 - Tell me How much balance in the user John?, 
                the SQL command will be something like this SELECT BALANCE FROM USER WHERE NAME = 'John';\n
                Example 3 - Send 500 from user "John" to "Ram"!,
                the SQL command will be something like this UPDATE USER SET BALANCE = BALANCE - 500 WHERE NAME = 'John'; UPDATE USER SET BALANCE = BALANCE + 500 WHERE NAME = 'Ram';\n
                also the sql code should not have ``` in beginning or end and sql word in the output.
            """
        ]
    short_question = question[len(secure_chat):].strip()
    response = get_gemini_response(short_question, prompt)
    # print(response)
    read_sql_query(response, "user.db")
    if response:
        messages = [
            {"role": "system", "content": "Your nickname is Jarvis and you are a helpful assistant. You have to reply the success message which is related to the user question. Don't add extra words in success message."},
            {"role": "user", "content": short_question}
        ]

        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        chat_response_text = completion.choices[0].message.content

        return chat_response_text



# documents = SimpleDirectoryReader("data").load_data()
# index = VectorStoreIndex.from_documents(documents, show_progress=False)

# @app.route("/document", methods=['POST'])
# def document():
#     try:
#         start_time = time.time() #Start Time

#         data = request.get_json()

#         prompt = data.get('prompt')

#         query_engine = index.as_query_engine()

#         response = query_engine.query(prompt)

#         answer = str(response)

#         end_time = time.time() # End Time
#         response_time = end_time - start_time
#         print(f"Response time: {response_time} seconds")

#         return jsonify({"answer": answer})
#     except Exception as e:
#         print(str(e), 500)
    
pdfreader = PdfReader('data/clarus text.pdf')

raw_text = ""

for i, page in enumerate(pdfreader.pages):
    content = page.extract_text()
    if content:
        raw_text += content

text_splitter = CharacterTextSplitter(
    separator = "\n",
    chunk_size = 800,
    chunk_overlap = 200,
    length_function = len,
)

texts = text_splitter.split_text(raw_text)

embeddings = OpenAIEmbeddings()

document_search = FAISS.from_texts(texts, embeddings)

chain = load_qa_chain(OpenAI(), chain_type="stuff")

@app.route("/document", methods=['POST'])
def document():
    try:
        start_time = time.time() #Start Time

        data = request.get_json()

        query = data.get('prompt')

        docs = document_search.similarity_search(query)
        
        answer = chain.run(input_documents = docs, question=query)

        end_time = time.time() # End Time
        response_time = end_time - start_time
        print(f"Response time: {response_time} seconds")

        return jsonify({"answer": answer})
    except Exception as e:
        print(str(e), 500)


@app.route("/sqldb", methods=['POST'])
def sqldb():
    try:
        data = request.get_json()

        question = data.get('question')

        response = genai_chat_send(question)

        answer = str(response)

        return jsonify({"answer": answer})
    except Exception as e:
        print(str(e), 500)

@app.route("/btc", methods=['POST'])
def btc():
    try:
        rate = "The rate of 1BTC is $68399.40"
        answer = str(rate)
        return jsonify({"answer": answer})
    except Exception as e:
        print(str(e), 500)


if __name__ == '__main__':
    app.run(debug=True)