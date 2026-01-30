from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    status
)
from sqlalchemy.orm import Session

from models import User,Mentee
from repository import auth_repo
import utils
router = APIRouter(prefix="/auth", tags=["Auth"])

# =========================
# EMAIL + PASSWORD
# =========================
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...)
):
    return auth_repo.signup(username, email, password)


@router.post("/login", status_code=status.HTTP_200_OK)
def login(
    email: str = Form(...),
    password: str = Form(...)
):
    return auth_repo.login(email, password)


# =========================
# GOOGLE OAUTH
# =========================
@router.get("/google", status_code=status.HTTP_201_CREATED)
def google_login():
    return auth_repo.google_login()


@router.get("/google/callback")
def google_callback(code: str):
    return auth_repo.google_callback(code)


# =========================
# LINKEDIN OAUTH
# =========================
@router.get("/linkedin", status_code=status.HTTP_201_CREATED)
def linkedin_login():
    return auth_repo.linkedin_login()


@router.get("/linkedin/callback")
def linkedin_callback(code: str):
    return auth_repo.linkedin_callback(code)

# =========================
# ROLE SELECTION
# =========================
@router.post("/set-role", status_code=status.HTTP_200_OK)
def set_role(
    role: str,
    user: User = Depends(utils.get_current_user),
    db: Session = Depends(utils.get_db)
):
    return auth_repo.set_role(role, user, db)


# =========================
# MENTEE PROFILE
# =========================
@router.post("/create-profile/mentee", status_code=status.HTTP_201_CREATED)
def create_profile(
    name: str = Form(...),
    bio: str = Form(...),
    photo: UploadFile | None = File(None),
    user: User = Depends(utils.get_current_user),
    db: Session = Depends(utils.get_db)
):
    return auth_repo.create_profile(name, bio, photo, user, db)

@router.get("/me")
def get_me(user: User = Depends(utils.get_current_user)):
    return auth_repo.get_me(user)
