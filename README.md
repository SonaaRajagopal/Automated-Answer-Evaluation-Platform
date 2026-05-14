# Automated Answer Evaluation Platform

An AI-powered full-stack platform for automated answer script evaluation, semantic document retrieval, and intelligent querying across large-scale academic and regulatory datasets.

---

# 🚀 Features

* AI-powered answer script evaluation using GPT-4o
* Retrieval-Augmented Generation (RAG) pipeline
* Semantic search with FAISS vector database
* Context-aware response generation
* Upload and process large-scale documents
* Asynchronous evaluation workflows
* Secure cloud storage with Azure Blob Storage
* Modern React + TypeScript frontend
* FastAPI backend with scalable API architecture
* Dockerized deployment support

---

# 🛠️ Tech Stack

## Frontend

* ReactJS
* TypeScript
* Tailwind CSS

## Backend

* FastAPI
* Python

## AI / ML

* Azure OpenAI (GPT-4o)
* FAISS Vector Database
* Embedding-based Semantic Retrieval
* Retrieval-Augmented Generation (RAG)

## Cloud & DevOps

* Azure Blob Storage
* Docker

---

# 📌 Project Overview

The Automated Answer Evaluation Platform is designed to streamline answer script assessment and document intelligence workflows using Large Language Models and vector-based retrieval systems.

The platform allows users to:

* Upload answer sheets and reference documents
* Perform semantic search across large datasets
* Generate AI-assisted evaluations and feedback
* Retrieve context-aware answers from uploaded documents
* Process educational and regulatory content efficiently

The system combines modern full-stack engineering with scalable AI infrastructure to deliver intelligent and production-ready evaluation workflows.

---

# 🧠 System Architecture

```text
Frontend (React + TypeScript)
        ↓
FastAPI Backend
        ↓
Document Processing Pipeline
        ↓
Text Chunking + Embeddings
        ↓
FAISS Vector Store
        ↓
Azure OpenAI GPT-4o
        ↓
Evaluation & Response Generation
```

---

# ⚙️ Core Functionalities

## 1. Document Upload & Processing

* Upload PDFs and text-based documents
* Extract and preprocess content
* Store files securely in Azure Blob Storage

## 2. Semantic Retrieval

* Generate embeddings for document chunks
* Store vectors using FAISS
* Retrieve contextually relevant information

## 3. AI-Powered Evaluation

* Evaluate answers using GPT-4o
* Generate feedback and contextual scoring
* Support intelligent academic assessment workflows

## 4. RAG-based Querying

* Combine retrieval + generation
* Provide accurate, context-aware responses
* Reduce hallucinations using retrieved document context

---

# 📂 Project Structure

```bash
Automated-Answer-Evaluation-Platform/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Backend/
│   ├── app/
│   ├── routes/
│   ├── services/
│   ├── vectorstore/
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

# 🐳 Docker Setup

## Clone the Repository

```bash
git clone <your-repository-link>
cd Automated-Answer-Evaluation-Platform
```

## Start the Application

```bash
docker-compose up --build
```

---

# 🔧 Backend Setup

```bash
cd Backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# 💻 Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_DEPLOYMENT=gpt-4o

AZURE_STORAGE_CONNECTION_STRING=your_connection_string

EMBEDDING_MODEL=text-embedding-model
```

---

# 📈 Future Improvements

* Multi-user authentication system
* Role-based access control
* Rubric-based evaluation
* Real-time collaboration
* Analytics dashboard
* OCR support for handwritten answer sheets
* CI/CD deployment pipeline

---

# 🎯 Use Cases

* Academic answer sheet evaluation
* Regulatory document analysis
* AI-powered educational platforms
* Enterprise knowledge retrieval systems
* Intelligent document querying applications

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit pull requests.

---

# 📜 License

This project is licensed under the MIT License.

---

# 👩‍💻 Author

Sonaa Rajagopal

LinkedIn: [www.linkedin.com/in/sonaa-rajagopal](http://www.linkedin.com/in/sonaa-rajagopal)
GitHub: [https://github.com/SonaaRajagopal](https://github.com/SonaaRajagopal)
