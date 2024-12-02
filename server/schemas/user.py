# app/schemas/user.py
from pydantic import BaseModel, EmailStr, constr
from typing import Optional

class UserBase(BaseModel):
    fname: str
    lname: str
    email: str
    phone: str
    username: str
    phone: Optional[str] = None
    

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
        
class CustomActivityBase(BaseModel):
    name: str
    desc: Optional[str] = None
    
class CustomActivity(CustomActivityBase):
    id: int
    class Config:
        orm_mode = True
        
class RewardBase(BaseModel):
    mood: Optional[int] = None
    activity: Optional[int] = None
    journal: Optional[int] = None
    strike: Optional[int] = None
    
class Reward(RewardBase):
    id: int
    class Config:
        orm_mode = True

class UpdateCustomActivity(CustomActivityBase):
    name: Optional[str] = None
    desc: Optional[str] = None
    class Config:
        orm_mode = True
        
class UpdateReward(RewardBase):
    mood: Optional[int] = None
    activity: Optional[int] = None
    journal: Optional[int] = None
    strike: Optional[int] = None
    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: User
    class Config:
        orm_mode = True

