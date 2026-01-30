from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session
import utils
from repository import mentee_repo

router = APIRouter(prefix="/mentee", tags=["Mentee"])

@router.get("/mentors")
def get_mentors(db: Session = Depends(utils.get_db)):
    return mentee_repo.get_mentors(db)

@router.get("/profile")
def get_profile(
    user = Depends(utils.get_current_user),
    db: Session = Depends(utils.get_db)
):
    return mentee_repo.get_profile(user,db)