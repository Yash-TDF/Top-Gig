from pydantic import BaseModel, EmailStr
# ---------------- Schemas ----------------
class Signup(BaseModel):
    username: str
    # role: str
    email: EmailStr
    password: str

class Login(BaseModel):
    email: EmailStr
    password: str
