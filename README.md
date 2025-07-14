# College Study Planner

A comprehensive web application designed to help college students manage their coursework, assignments, and study schedules efficiently. It processes course syllabi and other documents to generate a day-by-day study plan, visualized on an interactive calendar.

## Features

*   **Intelligent Study Plan Generation**: Upload course syllabi and assignments (PDF, DOCX) to automatically generate a detailed study plan using AI.
*   **Interactive Calendar**: Visualize your study plan on a dynamic calendar, showing tasks for each day with color-coded class associations.
*   **Class Management**: Create and manage your courses, each assigned a unique color for easy identification.
*   **Customizable Day Preferences**: Disable specific days (e.g., Saturdays) from your study schedule to align with your personal preferences.
*   **Multi-Document Upload**: Upload multiple course documents at once or add them later, assigning them to specific classes.
*   **Persistent Data**: All your classes, day preferences, and study tasks are saved locally in your browser, so your data persists across sessions.
*   **Backend Integration**: Seamlessly integrates with a Python FastAPI backend for AI-powered document processing and study plan generation.
*   **Data Reset**: Easily clear all local data for testing or starting fresh.

## 🚀 Technologies Used

### Frontend
*   **Next.js**: React framework for building the web application.
*   **React**: For building interactive user interfaces.
*   **Tailwind CSS**: For rapid and responsive UI styling.
*   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
*   **react-calendar**: A flexible and customizable calendar component.
*   **TypeScript**: For type-safe JavaScript.

### Backend
*   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python.
*   **LangChain**: Framework for developing applications powered by language models.
*   **OpenAI**: For AI model integration (e.g., GPT-4o for study plan generation).
*   **PyPDFLoader**: For loading PDF documents.

## ⚙️ Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rafzal2020/CollegePlanner
```

### 2. Backend Setup (Python FastAPI)

Ensure you have Python 3.8+ installed.

1.  **Navigate to the backend app directory and run**:
    ```bash
    cd backend
    ```
2.  **Create a virtual environment and activate it**:
    ```bash
    python -m venv venv
    source venv/bin/activate # On Windows: `venv\Scripts\activate`
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Create a `.env` file** in your backend root directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY="your_openai_api_key_here"
    ```
5.  **Run the backend server**:
    ```bash
    cd app
    python -m uvicorn main:app --reload                                                                                                      
    ```
    The backend will typically run on `http://127.0.0.1:8000`.

### 3. Frontend Setup (Next.js)

1.  **Navigate to your frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install Node.js dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env.local` file** in the frontend root directory and set your backend URL:
    ```
    NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8000"
    ```
    *Make sure this matches the address where your FastAPI backend is running.*
4.  **Run the frontend development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend will typically run on `http://localhost:3000`.

## 🚀 Usage

1.  **Open your browser** and navigate to `http://localhost:3000`.
2.  **Manage Classes**: Go to the "Classes" tab to add your courses (e.g., "Calculus I", "Computer Science II"). Each class will get a random color.
3.  **Set Day Preferences**: In the "Preferences" tab, enable or disable days you wish to study. By default, Saturdays are disabled.
4.  **Upload Documents**: Go to the "Upload" tab.
    *   Select the class the document belongs to from the dropdown.
    *   Click "Add Files" and select your syllabus, assignment sheets, or other course documents.
    *   Click "Upload File(s)" to send them to the backend for processing. The AI will generate tasks based on the document content.
5.  **View Study Plan**: Switch to the "Calendar" tab to see your generated study plan. Tasks will appear on their scheduled dates with their respective class colors.
6.  **Data Persistence**: Your classes, preferences, and tasks will automatically be saved in your browser's local storage, so they persist even if you close and reopen the tab.
7.  **Reset Data**: If you need to clear all local data (classes, preferences, cached tasks) for testing or a fresh start, go to the "Preferences" tab and use the "Reset All Data" option.
