#  Invoicy – Chat-Based Invoice Assistant

Invoicy is a minimal chat-based web assistant that allows users to manage invoices using natural language. It supports invoice creation, updates, item additions, and retrieval — with both deterministic flows and LLM-powered queries.

## Features

- Create, update, and view invoices through chat
- Natural language understanding powered by open-source LLM (Ollama + LLaMA3)
- Suggestion-based quick actions
- Auto-suggestion and flow chaining (e.g., adding invoice items after creating an invoice)
- Type-safe backend using .NET 9 Web API
- Clean, modular Angular 20 frontend
- Responsive UI
- Arabic query support (via LLM)

---

## 📁 Project Structure
Invoice-Chatbot/
├── backend/ # .NET 9 Web API + Entity Framework
├── frontend/ # Angular 20 frontend (chat interface)
├── llm/ # Python RAG server (FastAPI + LangChain + Ollama)
├── scripts/ # SQL script to set up PostgreSQL schema
└── README.md

---

### 🔧 Backend

- [.NET SDK 9](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/) (configured locally)

### 🧠 LLM Server

- Python 3.10+
- Ollama
- LLaMA 3 (8B, q5_K_M)

### 🎨 Frontend

- Node.js 20+
- Angular CLI 17+

---

## ⚙️ Setup Instructions

### 1. 🐘 PostgreSQL Setup

- Create a database named `InvoiceDb`.
- Run the script from `scripts/init.sql` to set up the schema.
- 
Make sure your connection string in `appsettings.json` (backend) points to PostgreSQL:
```json
"ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=InvoiceDb;Username=your-username;Password=your-password"
  }
```

### 2. 🔙 Backend Setup (.NET 9)

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
API will run on: http://localhost:5299

### 3. 🧠 LLM Setup (LangChain + Ollama)

Create and activate virtual environment:

```bash
cd llm
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Pull LLaMA 3 model:

```bash
ollama pull llama3:8b-instruct-q5_K_M
```
LLM server runs on: http://localhost:8000

### 4. 💬 Frontend Setup (Angular 20)

```bash
cd frontend
npm install
ng serve
```
Frontend runs on: http://localhost:4200

## 💡 Sample Supported Queries

### Deterministic Flows

* "Create an invoice"
* "Update invoice"
* "Delete"
* "Show Invoice Details"

### LLM Example Queries

* Show me the total value ofinvoices this month
* Give me a summary of invoice INV-16
* How many invoices were issued last week?
* كم عدد الفواتير غير المدفوعة؟


## 🧱 Architecture Highlights

* Clean separation between:
  * Frontend (Angular chat UI)
  * Backend (.NET API for CRUD + Flow handling)
  * LLM Server (RAG-powered intelligent queries)
* Strongly typed DTOs and services
* Easily extendable deterministic flow engine
