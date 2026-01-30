from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), nullable=True)
    role = Column(String(50), nullable=True)

    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)

    provider = Column(String(20), nullable=False)

    email_verified_at = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )


class Mentee(Base):
    __tablename__ = "mentee"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    name = Column(String(100), nullable=True) 
    profile_pic = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)

class Mentor(Base):
    __tablename__ = "mentor"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    name = Column(String(100), nullable=False)
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    profile_pic = Column(String(255), nullable=True)
