# ingest.py

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings 
# Gunakan langchain_chroma yang baru
from langchain_chroma import Chroma 

# Konfigurasi Path
DB_PATH = "./chroma_db"


# Model Multilingual (Harus sama persis dengan main.py)
embedding_function = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

def ingest_specific_file(filepath):
    print(f"🔄 AI Belajar File: {filepath}")
    if not os.path.exists(filepath):
        return False, f"File tidak ditemukan: {filepath}", ""

    try:
        loader = PyPDFLoader(filepath)
        docs = loader.load()
        if not docs: return False, "PDF kosong", ""

        full_text = "\n\n".join([doc.page_content for doc in docs])
            
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(docs)
        
        Chroma.from_documents(documents=chunks, embedding=embedding_function, persist_directory=DB_PATH)
        return True, f"Sukses mempelajari {len(chunks)} potongan teks dari {len(docs)} halaman.", full_text
    except Exception as e:
        print(f"Error: {e}")
        return False, str(e), ""
    
    