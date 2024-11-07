# app/models/user.py
from sqlalchemy import Column, Integer, String
from server.database import Base
from passlib.context import CryptContext
from sqlalchemy.orm import relationship

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fname = Column(String, index=True)
    lname = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String, unique=True)
    username = Column(String, unique=True)

    moods = relationship("Mood", back_populates="user")
    
    def verify_password(self, password: str):
        return pwd_context.verify(password, self.password)

    @classmethod
    def hash_password(cls, password: str):
        return pwd_context.hash(password)