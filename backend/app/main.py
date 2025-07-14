import os

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import dotenv
import tempfile
import json
import re

app = FastAPI()

dotenv.load_dotenv()
dotenv = dotenv.dotenv_values(".env")
openai_api_key = dotenv.get("OPENAI_API_KEY")

stored_study_plan = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    day_preferences: Optional[str] = Form(None),
    class_id: str = Form(None)
):
    global stored_study_plan
    all_pages = []

    print("Received files")
    print("Starting AI process...")

    # Parse day preferences
    available_days = []
    if day_preferences:
        try:
            preferences = json.loads(day_preferences)
            available_days = [day for day, enabled in preferences.items() if enabled]
            print(f"Available study days: {available_days}")
        except json.JSONDecodeError:
            print("Failed to parse day preferences, using all days")
            available_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    for file in files:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
    
        loader =  PyPDFLoader(tmp_path)
        pages = loader.load()
        all_pages.extend([page.page_content for page in pages])

        os.remove(tmp_path)  # Clean up the temporary file
    
    combined_pages = "\n".join(all_pages)
    print(combined_pages)  # Print the first 500 characters for debugging

    llm = ChatOpenAI(
        openai_api_key=openai_api_key,
        model_name="gpt-4o",
        temperature=0.3
    )
    
    # Create day preferences instruction
    day_instruction = ""
    if available_days:
        day_instruction = f"""
        IMPORTANT: The user has specified that they only want to study on these days: {', '.join(available_days)}.
        When creating the study plan, ONLY assign tasks to dates that fall on these days of the week.
        If a task would normally be assigned to a day not in this list, move it to the nearest available study day.
        For example, if the user doesn't study on Saturdays, move any Saturday tasks to Friday or Sunday.
        """

    prompt = ChatPromptTemplate.from_template("""
    You are a college study planner bot. Given multiple syllabi and other course documents, create a day-by-day study plan with specific tasks.
    Your goal is to help students manage their time effectively and ensure they are prepared for exams, homework, and readings.
    Read the dates carefully then assign tasks accordingly.Sometimes, you will come across tables that contain dates and tasks. 
    Extract the dates and tasks from these tables and include them in the JSON output. An example of a table is:
    
    | Date       | Topics              | Homework/Readings              |
    |------------|---------------------|    ---------                   |
    | 2025-09-01 | Introduction        |   Read Chapter 1, Chapter 1 HW |
    | 2025-09-03 | Algorithms          |       HW1 Due                  |
    | ...        | ...                 |....                            |
    
    As a planner, you must decide on when a student should read a chapter, complete homework, or prepare for exams. Be sure 
    to not be overwhelming with the tasks, and spread them out evenly across the semester. Additionally, add tasks that are not
    explicitly mentioned in the syllabus, such as reviewing previous material, preparing for exams, or working on projects.
    
    {day_preferences_instruction}
                                                  
    The output should be a JSON array of objects with "date" and "task" keys. Don't include any text other than the JSON output.
                                                  
                                                  
    Provide JSON like:
    [
      {{"date": "2024-09-01", "task": "Read Chapter 1"}},
      {{"date": "2024-09-03", "task": "Complete Homework 1"}},
      ...
    ]

    Document:
    {text}
    """)

    chain = prompt | llm
    response = chain.invoke({
        "text": combined_pages,
        "day_preferences_instruction": day_instruction
    })
    print("AI process completed")

    try:
        # Use regex to extract content between ```json and ```
        response_text = str(response.content)
        match = re.search(r"```(?:json)?\s*(\[.*?\])\s*```", response_text, re.DOTALL)
        if match:
            plan_json = json.loads(match.group(1))
        else:
            # fallback: try parsing raw text if no code block
            plan_json = json.loads(response_text.strip())
        
        new_tasks_with_class_id = []
        for item in plan_json:
            item["classId"] = class_id # Add classId here
            new_tasks_with_class_id.append(item)
        
        # Merge new plan with stored_study_plan, avoiding duplicates
        existing = set((item["date"], item["task"]) for item in stored_study_plan)
        new_items = [item for item in plan_json if (item["date"], item["task"]) not in existing]
        stored_study_plan.extend(new_items)
        return {"plan": stored_study_plan}
    except Exception as e:
        return {"error": str(e), "raw_response": response.content}


@app.get("/upload")
async def print_files():
    """Prints the contents of the uploaded files."""
    print("Stored study plan:", stored_study_plan)
    return {"plan": stored_study_plan}

@app.get("/")
async def root():
    return {"message": "Welcome to the College Planner API!"}