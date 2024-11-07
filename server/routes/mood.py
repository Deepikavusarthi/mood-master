# app/routes/mood.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.models.mood import Mood as MoodModel, Journal as JournalModel, Activity as ActivityModel
from server.models.user import User
from server.schemas.mood import MoodCreate, Mood
from server.database import get_db
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from server import utils
from datetime import datetime
from sqlalchemy import func
# current_user = get_current_user()
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, utils.SECRET_KEY, algorithms=[utils.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    db = next(get_db())
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/", response_model=Mood)
def create_mood(mood: MoodCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_mood = MoodModel(
        mood_type=mood.mood_type,
        user_id=current_user.id,
        ai_insights=mood.ai_insights,
    )
    db.add(db_mood)
    db.commit()
    db.refresh(db_mood)  # Refresh the instance to get the new data

    # Add journals and activities if provided
    for journal in mood.journals:
        db_journal = JournalModel(**journal.dict(), mood_id=db_mood.id)
        db.add(db_journal)

    for activity in mood.activities:
        db_activity = ActivityModel(**activity.dict(), mood_id=db_mood.id)
        db.add(db_activity)

    db.commit()  # Commit the transaction for journals and activities
    return db_mood

@router.get("/")
def read_moods(skip: int = 0, limit: int = 10,current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    moods = db.query(MoodModel).filter(MoodModel.user_id == current_user.id).offset(skip).limit(limit).all()  # Filter by current user
    return moods

@router.get("/{mood_id}")
def read_mood(mood_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()  # Ensure the mood belongs to the current user
    if mood is None:
        raise HTTPException(status_code=404, detail="Mood not found")
    return {
        "id": mood.id,
        "created_at": mood.created_at,
        "updated_at": mood.updated_at,
        "user_id": mood.user_id,
        "ai_insights": mood.ai_insights,
        "mood_type": mood.mood_type,
        "journals": mood.journals,
        "activities": mood.activities
    }

# read mode by date wise from the params with all journals and activities
from datetime import datetime

@router.get("/date/{date}")
def read_mood_by_date(date: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    date_time_obj = datetime.strptime(date, '%Y-%m-%d')
    moods = db.query(MoodModel).filter(MoodModel.user_id == current_user.id, func.date(MoodModel.created_at) == date_time_obj.date()).all()
    for mood in moods:
        mood.journals = db.query(JournalModel).filter(JournalModel.mood_id == mood.id).all()
        mood.activities = db.query(ActivityModel).filter(ActivityModel.mood_id == mood.id).all()
    return moods

@router.put("/{mood_id}")
def update_mood(mood_id: int, mood: MoodCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    db_mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()  # Ensure the mood belongs to the current user
    if db_mood is None:
        raise HTTPException(status_code=404, detail="Mood not found")

    for key, value in mood.dict(exclude={"journals", "activities"}).items():
        setattr(db_mood, key, value)

    db.commit()
    db.refresh(db_mood)
    return db_mood

@router.delete("/{mood_id}")
def delete_mood(mood_id: int, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    db_mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()  # Ensure the mood belongs to the current user
    if db_mood is None:
        raise HTTPException(status_code=404, detail="Mood not found")
    db.delete(db_mood)
    db.commit()
    return db_mood