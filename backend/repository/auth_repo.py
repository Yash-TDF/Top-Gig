from fastapi import  HTTPException,UploadFile, File, Form,Depends
from fastapi.responses import RedirectResponse
import requests
from database import SessionLocal
from models import User,Mentee
from utils import create_jwt,verify_password,hash_password,get_current_user
from sqlalchemy.orm import Session
import os,uuid
from datetime import datetime

# ---------------- CONFIG ----------------
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")
# ---------------- 1️⃣ EMAIL + PASSWORD --------------------

def signup(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...)
):
    db = SessionLocal()

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(400, "User already exists")

    user = User(
        username=username,
        email=email,
        password=hash_password(password),
        provider="local",
        role=None
    )

    db.add(user)
    db.commit()

    token = create_jwt({"email": email})

    response = RedirectResponse(
        "http://localhost:5173/role-selection",
        status_code=302  # 🔥 THIS FIXES IT
    )
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
    )

    return response

def login(
    email: str = Form(...),
    password: str = Form(...)
):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(401, "Invalid credentials")

    token = create_jwt({"email": email})
    redirect_url = (
        "http://localhost:5173/role-selection"
        if user.role is None
        else "http://localhost:5173/mentee-dashboard"
    )
    response = RedirectResponse(redirect_url, status_code=302)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax"
    )
    return response

# ---------------- 2️⃣ GOOGLE OAUTH ----------------
def google_login():
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&scope=openid%20email%20profile"
    )
    return RedirectResponse(url)


def google_callback(code: str):
    # 1️⃣ Exchange code for token
    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
    ).json()

    if "access_token" not in token_res:
        raise HTTPException(400, "Google token exchange failed")

    # 2️⃣ Fetch user info
    userinfo = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={
            "Authorization": f"Bearer {token_res['access_token']}"
        }
    ).json()


    email = userinfo.get("email")
    name = userinfo.get("name")

    if not email:
        raise HTTPException(400, "Email not returned by Google")

    # 3️⃣ DB insert
    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            email=email,
            username=name,
            provider="google",
            role=None,
            email_verified_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_jwt({"email": email})
    redirect_url = (
        "http://localhost:5173/role-selection"
        if user.role is None
        else "http://localhost:5173/mentee-dashboard"
    )

    response = RedirectResponse(redirect_url, status_code=302)
    response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            samesite="lax",
            secure=False,   # True in production (HTTPS)
        )
    return response
# ---------------- 3️⃣ LINKEDIN OAUTH ----------------
def linkedin_login():
    url = (
        "https://www.linkedin.com/oauth/v2/authorization"
        "?response_type=code"
        f"&client_id={LINKEDIN_CLIENT_ID}"
        f"&redirect_uri={LINKEDIN_REDIRECT_URI}"
        "&scope=openid%20profile%20email"
    )
    return RedirectResponse(url)

def linkedin_callback(code: str):
    token_res = requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": LINKEDIN_REDIRECT_URI,
            "client_id": LINKEDIN_CLIENT_ID,
            "client_secret": LINKEDIN_CLIENT_SECRET,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    ).json()

    userinfo= requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {token_res['access_token']}"}
    ).json()
    db = SessionLocal()
    email = userinfo["email"]

    if not db.query(User).filter(User.email == email).first():
        db.add(User(
        email=email,
        username=userinfo.get("name"),
        provider="linkedin",
        role=None,
        email_verified_at=datetime.utcnow()
        ))
        db.commit()

    token = create_jwt({"email": email})
    user = db.query(User).filter(User.email == email).first()
    redirect_url = (
        "http://localhost:5173/role-selection"
        if user.role is None
        else "http://localhost:5173/mentee-dashboard"
    )

    response = RedirectResponse(redirect_url, status_code=302)
    response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            samesite="lax",
            secure=False,   # True in production (HTTPS)
        )
    return response

#-----------------------Role-Selection-------------------------------
def set_role(role: str, user: User, db: Session):
    if user.role is not None:
        raise HTTPException(403, "Role already selected")

    if role not in ["Mentor", "Mentee"]:
        raise HTTPException(400, "Invalid role")
    
    user.role = role
    db.commit()
    return {"message": "Role set successfully"}

#----------------------Mentee-Profile----------------------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
def create_profile(
    name: str,
    bio: str,
    photo: UploadFile | None,
    user: User ,
    db: Session 
):
    existing = db.query(Mentee).filter(Mentee.user_id == user.id).first()
    if existing:
        raise HTTPException(400, "Mentee profile already exists")
    mentee = Mentee(
        user_id=user.id,
        name=name,
        bio=bio
    )
    if photo:
        filename = f"{uuid.uuid4()}_{photo.filename}"
        path = f"{UPLOAD_DIR}/{filename}"

        with open(path, "wb") as f:
            f.write(photo.file.read())

        mentee.profile_pic = path
    db.add(mentee)
    db.commit()
    db.refresh(mentee)
    return {"message": "Profile created successfully"}

def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }