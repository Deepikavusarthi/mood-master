# app/schemas/mood.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JournalBase(BaseModel):
    text: str
    tags: Optional[str] = None

class ActivityBase(BaseModel):
    name: str
    duration: int  # Duration in minutes
    type: str
    quantity: Optional[float] = None
    gain: Optional[float] = None

class MoodBase(BaseModel):
    mood_type: str
    ai_insights: Optional[str] = None

class MoodCreate(MoodBase):
    journals: List[JournalBase] = []
    activities: List[ActivityBase] = []

class Mood(MoodBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Journal(JournalBase):
    id: int
    mood_id: int

    class Config:
        orm_mode = True

class Activity(ActivityBase):
    id: int
    mood_id: int

    class Config:
        orm_mode = True