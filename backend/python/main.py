import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uuid
import os
import json
import numpy as np
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import OpenAIEmbeddings
from datetime import datetime
import faiss
from dotenv import load_dotenv
# Models
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI

# Env loads
load_dotenv()

# -------------------------------------------- LLM model
model = ChatOpenAI()

# ---------------------------------------------- Load PDF
import PyPDF2

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

# ---------------------------------------------- Text splitting
from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 0) -> list[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    return text_splitter.split_text(text)

# ---------------------------------------------- Embedding
embedding = OpenAIEmbeddings()

# ----------------------- Prompt template globally
prompt_template = ChatPromptTemplate.from_template("""
You are an expert assistant. Based on the following context, answer the question concisely and accurately:
Context: {context}
Question: {question}
Answer: """)

# ------------------------------------ Initialize FAISS folder and load existing indexes
FAISS_DB_DIR = "faissdb"
vector_stores: dict[str, dict] = {}

def ensure_faiss_db_dir():
    """Create faissdb directory if it doesn't exist."""
    if not os.path.exists(FAISS_DB_DIR):
        os.makedirs(FAISS_DB_DIR)

def load_existing_indexes():
    """Load existing FAISS indexes and chunks from faissdb folder."""
    ensure_faiss_db_dir()
    for filename in os.listdir(FAISS_DB_DIR):
        if filename.endswith(".faiss"):
            upload_id = filename.replace(".faiss", "")
            index_path = os.path.join(FAISS_DB_DIR, filename)
            chunks_path = os.path.join(FAISS_DB_DIR, f"{upload_id}.json")
            
            # Load FAISS index
            index = faiss.read_index(index_path)
            
            # Load chunks if they exist
            chunks = []
            if os.path.exists(chunks_path):
                with open(chunks_path, 'r') as f:
                    chunks = json.load(f)
            
            vector_stores[upload_id] = {
                'index': index,
                'chunks': chunks,
                'index_path': index_path
            }
    print("Loaded existing FAISS indexes and chunks.")
# ------------------------------------ API Routes -------------------------------------
app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["0.0.0.0/0","http://localhost:3000"],  # Adjust to your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    current_datetime = datetime.now()
    upload_id = str(uuid.uuid4())
    file_path = f'/tmp/{current_datetime.strftime("%Y-%m-%d_%H-%M-%S")}_{upload_id}.pdf'

    try:
        # Save uploaded file temporarily
        with open(file_path, 'wb') as f:
            f.write(await file.read())  # Use await for async read
        
        # Extract and chunk text
        text = extract_text_from_pdf(file_path)
        chunks = chunk_text(text)
        embeddings = np.array(embedding.embed_documents(chunks))
        
        # Create and save FAISS index
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings)
        
        # Save FAISS index to disk
        ensure_faiss_db_dir()
        index_path = os.path.join(FAISS_DB_DIR, f"{upload_id}.faiss")
        faiss.write_index(index, index_path)
        
        # Save chunks to disk
        chunks_path = os.path.join(FAISS_DB_DIR, f"{upload_id}.json")
        with open(chunks_path, 'w') as f:
            json.dump(chunks, f)
        
        # Store in memory
        vector_stores[upload_id] = {
            'index': index,
            'chunks': chunks,
            'index_path': index_path
        }
        
        return JSONResponse(content={
            "message": "File uploaded successfully",
            "upload_id": upload_id,
            "chat_route": f"/chat/{upload_id}"
        })
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# ------------------------------------------ Chatbot with AI RAG ----------------
class Query(BaseModel):
    question: str

@app.post("/chat/{upload_id}")
async def chat_with_document(upload_id: str, query: Query):
    if upload_id not in vector_stores:
        raise HTTPException(status_code=404, detail="Upload id not found")
    
    store = vector_stores[upload_id]
    index = store['index']
    chunks = store['chunks']
    
    question_embedding = np.array([embedding.embed_query(query.question)])
    
    k = 3
    distances, indices = index.search(question_embedding, k)
    
    relevant_chunks = [chunks[i] for i in indices[0] if i < len(chunks)]
    context = '\n'.join(relevant_chunks)
    
    prompt_text = prompt_template.format(context=context, question=query.question)
    response = model.invoke(prompt_text)
    answer = response.content.strip()
    
    return {"answer": answer}

@app.get('/')
def root():
    return {'message': 'RAG as Services'}

def main():
    print("Starting RAG-as-service...")
    # Load existing FAISS indexes on startup
    load_existing_indexes()
    uvicorn.run(app, host="0.0.0.0", port=5000)

if __name__ == "__main__":
    main()