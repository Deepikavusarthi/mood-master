from pydantic import BaseModel, EmailStr, constr
from typing import Optional

class UserBase(BaseModel):
    fname: str
    lname: str
    email: str
    phone: str
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    fname: str = None
    lname: str = None
    username: str = None
    phone: str = None
    class Config:
        orm_mode = True