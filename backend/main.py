from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from database import Base,engine
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_router, mentee_router
# ---------------- APP ----------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(auth_router)
app.include_router(mentee_router)