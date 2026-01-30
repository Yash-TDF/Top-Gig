from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile
)
from typing import Optional
from sqlalchemy.orm import Session
import utils
from repository import mentee_repo
from models import User
router = APIRouter(prefix="/mentee", tags=["Mentee"], dependencies=[Depends(utils.get_current_user)])

@router.get("/mentors")
def get_mentors(db: Session = Depends(utils.get_db)):
    return mentee_repo.get_mentors(db)

@router.get("/profile")
def get_profile(
    user = Depends(utils.get_current_user),
    db: Session = Depends(utils.get_db)
):
    return mentee_repo.get_profile(user,db)

@router.put("/update-profile")
def update_profile(
    name: Optional[str] = Form(...),
    bio: Optional[str] = Form(...),
    photo: Optional[UploadFile]| None = File(None),
    user: User = Depends(utils.get_current_user),
    db: Session = Depends(utils.get_db)
):
    return mentee_repo.update_profile(name,bio,photo,user,db)