from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base
from datetime import datetime
class Mood(Base):
    __tablename__ = 'moods'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id',ondelete='CASCADE'))
    ai_insights = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # Automatically update on change
    mood_type = Column(String(50))

    user = relationship("User", back_populates="moods")
    journals = relationship("Journal", back_populates="mood")
    activities = relationship("Activity", back_populates="mood")

class Journal(Base):
    __tablename__ = 'journals'

    id = Column(Integer, primary_key=True, index=True)
    mood_id = Column(Integer, ForeignKey('moods.id',ondelete='CASCADE'))
    text = Column(Text)
    tags = Column(String(255), nullable=True)

    mood = relationship("Mood", back_populates="journals")

class Activity(Base):
    __tablename__ = 'activities'

    id = Column(Integer, primary_key=True, index=True)
    mood_id = Column(Integer, ForeignKey('moods.id',ondelete='CASCADE'))
    name = Column(String(100))
    duration = Column(Integer)  # Duration in minutes
    type = Column(String(50))
    quantity = Column(Float, nullable=True)
    gain = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    mood = relationship("Mood", back_populates="activities")