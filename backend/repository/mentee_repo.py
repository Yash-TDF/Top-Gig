from fastapi import Depends
from models import Mentee,Mentor
from utils import get_current_user,get_db
from sqlalchemy.orm import Session
import os,uuid
from datetime import datetime


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
    return mentee