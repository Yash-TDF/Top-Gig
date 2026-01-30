from datetime import datetime, timedelta
from jose import jwt, JWTError
from database import SessionLocal
from passlib.context import CryptContext
from fastapi import  HTTPException,Depends,Request
from models import User
import os

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGO = os.getenv("JWT_ALGO")
JWT_EXP_MIN = int(os.getenv("JWT_EXP_MIN", 60))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------- UTILS ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(pwd: str):
    return pwd_context.hash(pwd)

def verify_password(pwd, hashed):
    return pwd_context.verify(pwd, hashed)

def create_jwt(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=JWT_EXP_MIN)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def get_current_user(
    request: Request,
    db = Depends(get_db)
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        email = payload.get("email")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user