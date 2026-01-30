from fastapi import Depends,Form,UploadFile,File,HTTPException
from models import Mentee,Mentor,User
from utils import get_current_user,get_db
from sqlalchemy.orm import Session
import os,uuid
from datetime import datetime
import utils
from typing import Optional

def get_mentors(db: Session = Depends(get_db)):
    mentors = db.query(Mentor).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "headline": m.headline,
            "profile_pic": m.profile_pic
        }
        for m in mentors
    ]

def get_profile(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mentee = db.query(Mentee).filter(Mentee.user_id == user.id).first()
    return {
       "name": mentee.name,
        "bio": mentee.bio,
        "profile_pic": mentee.profile_pic 
    }

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def update_profile(
    name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    user: User = Depends(utils.get_current_user),
    db: Session = Depends(utils.get_db),
):
    mentee = db.query(Mentee).filter(Mentee.user_id == user.id).first()

    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee profile not found")

    if name is not None:
        mentee.name = name

    if bio is not None:
        mentee.bio = bio

    if photo:
        filename = f"{uuid.uuid4()}_{photo.filename}"
        path = os.path.join(UPLOAD_DIR, filename)

        with open(path, "wb") as f:
            f.write(photo.file.read())

        mentee.profile_pic = path

    db.commit()
    db.refresh(mentee)

    return {
        "message": "Profile updated successfully",
        "profile": {
            "name": mentee.name,
            "bio": mentee.bio,
            "profile_pic": mentee.profile_pic,
        },
    }