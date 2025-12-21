# main.py

import os
import base64
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


# --- LIBRARY LANGCHAIN ---
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage

# Import fungsi ingest lokal
from ingest import ingest_specific_file
load_dotenv()

# --- KONFIGURASI ---
DB_PATH = "./chroma_db"

app = FastAPI()
@app.get("/")
def read_root():
    return {"status": "Server AI Medivora Siap Melayani! 🚀"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. SETUP MODEL RAG (TEXT)
# 🔥 PERBAIKAN 1: Model HARUS SAMA dengan ingest.py
embedding_function = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
llm_text = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2)

# 2. SETUP MODEL VISION (GAMBAR)
llm_vision = ChatGroq(model="llama-3.2-11b-vision-preview", temperature=0.2)

# Prompt Text RAG (Diperketat agar lebih teliti)
# Prompt Text RAG (Mode Ketat / Strict)
template = """Anda adalah asisten medis spesialis onkologi (kanker) bernama Medivora.
Tugas Anda adalah menjawab pertanyaan user MURNI HANYA berdasarkan data dari Konteks Jurnal di bawah ini.

Peraturan Keras:
1. Jawablah berdasarkan fakta yang ada di "Konteks Jurnal".
2. JANGAN menggunakan pengetahuan luar atau internet.
3. JANGAN mengarang jawaban (Halusinasi).
4. Jika jawaban tidak ditemukan di dalam potongan jurnal di bawah, Anda WAJIB menjawab persis kalimat ini: 
   "Maaf, informasi tersebut tidak ditemukan secara spesifik dalam dokumen jurnal yang Anda upload."

Konteks Jurnal:
{context}

Pertanyaan User: {question}

Jawaban:"""
prompt = ChatPromptTemplate.from_template(template)

class ChatRequest(BaseModel):
    query: str

class IngestRequest(BaseModel):
    filepath: str

# --- ENDPOINT 1: CHAT TEXT (RAG) ---
@app.post("/ask")
def ask_ai(request: ChatRequest):
    if not os.path.exists(DB_PATH):
        return {"answer": "Database AI kosong. Admin belum upload jurnal."}
    
    vector_db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function)
    
    # 🔥 PERBAIKAN 2: Gunakan MMR (Maximal Marginal Relevance)
    # MMR berguna untuk jurnal tebal: Dia mencari info yang relevan TAPI JUGA beragam (tidak redundan).
    # k=15 artinya dia akan membaca 15 potongan teks (cukup untuk ratusan halaman).
    retriever = vector_db.as_retriever(
        search_type="mmr", 
        search_kwargs={"k": 15, "fetch_k": 50}
    )

    # --- DEBUG: INTIP APA YANG DITEMUKAN ---
    docs = retriever.invoke(request.query)
    print(f"\n🔍 Pertanyaan: {request.query}")
    print(f"📄 AI Membaca {len(docs)} potongan teks dari berbagai halaman:")
    for i, doc in enumerate(docs):
        # Print sedikit saja biar terminal tidak penuh
        content = doc.page_content.replace('\n', ' ')
        print(f"[{i+1}] {content[:100]}...") 
    print("------------------------------------------------")
    
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt | llm_text | StrOutputParser()
    )
    return {"answer": rag_chain.invoke(request.query)}

# --- ENDPOINT 2: INGEST PDF (ADMIN) ---
@app.post("/ingest")
def trigger_ingest(request: IngestRequest):
    success, msg, full_text = ingest_specific_file(request.filepath)
    if success: return {"status": "success", "detail": msg, "extracted_text": full_text}
    else: raise HTTPException(status_code=500, detail=msg)

# --- ENDPOINT 3: ANALISIS GAMBAR (USER) ---
@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image_data = base64.b64encode(contents).decode("utf-8")
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": "Analisis gambar medis ini. Apakah ada indikasi kanker atau anomali? Jelaskan dengan bahasa medis yang sopan."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}},
            ]
        )
        response = llm_vision.invoke([message])
        return {"analysis": response.content}
        
    except Exception as e:
        print(f"Error Vision: {e}")
        return {"analysis": "Maaf, gagal menganalisis gambar."}