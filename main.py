from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel




app = FastAPI()

# Configure CORS to allow cross-origin requests
origins = ["*"]  # Update this list to restrict access to specific domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
# API endpoint to provide the chatbot embedding code
# @app.get("/chatbot", response_class=HTMLResponse)
# async def get_chatbot_script():
#     # Read the content of chatbot.js file and return it as a response
#     with open("static/chatbot.js", "r") as f:
#         chatbot_script = f.read()
#     return HTMLResponse(content=chatbot_script, media_type="application/javascript")
@app.get("/chatbot")
async def get_chatbot_script():
    return FileResponse("static/chatbot.js")

@app.get("/css")
async def get_chatbot_css():
        return FileResponse("static/style.css", media_type="text/css")

@app.get("/js")
async def get_app_js():
    return FileResponse("static/app.js", media_type="application/javascript")


@app.post("/predict")
async def predict(message: Message):
    try:
        print(message.message)
        response = {"answer": f"This is a dummy response to: '{message.message}'"}
        # response = genResponse(message.message)
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#app.include_router(router)  

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

    
