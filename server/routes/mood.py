# app/routes/mood.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.models.mood import Mood as MoodModel, Journal as JournalModel, Activity as ActivityModel
from server.models.user import User, Reward as RewardModel
from server.schemas.mood import MoodCreate, Mood, JournalBase, ActivityBase
from server.database import get_db
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from server import utils
from datetime import datetime
from sqlalchemy import func
from server.routes.ai import generate_ai_insights
# current_user = get_current_user()
from server.routes.auth import get_current_user
router = APIRouter()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/")
def create_mood(mood: MoodCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db_mood = MoodModel(
            mood_type=mood.mood_type,
            user_id=current_user.id,
            ai_insights=mood.ai_insights,
        )
        db.add(db_mood)
        db.commit()
        db.refresh(db_mood)
        
        # Add journals and activities if provided
        store_journals = []
        if mood.journal:
            for journal in mood.journal:
                store_journals.append(JournalModel(**journal.dict(), mood_id=db_mood.id))
            db.add_all(store_journals)
            db.commit()

        store_activities = []
        if mood.activities:
            for activity in mood.activities:
                store_activities.append(ActivityModel(**activity.dict(), mood_id=db_mood.id))
            db.add_all(store_activities)
            db.commit()
        reward = {
            "user_id": current_user.id,
            "mood":0,
            "journal":0,
            "activity":0
        }
        db.refresh(db_mood)
        ai_insights = generate_ai_insights(db_mood.id,current_user,db)
        db_mood.ai_insights = ai_insights
        db.commit()
        db.refresh(db_mood)
        print(db_mood)
        if db_mood:
            reward["mood"] = 1
        if store_journals:
            reward["journal"] = len(store_journals)
        if store_activities:
            reward["activity"] = len(store_activities)
        db_reward = db.query(RewardModel).filter(RewardModel.user_id == current_user.id).first()
        if db_reward:
            db_reward.mood += reward["mood"]
            db_reward.journal += reward["journal"]
            db_reward.activity += reward["activity"]
            db.commit()
            db.refresh(db_reward)
        db.refresh(db_mood)
        response = {
            "message":"Mood created successfully",
            "ai_insights":db_mood.ai_insights
        }
        return response
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def read_moods(skip: int = 0, limit: int = 10,current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        moods = db.query(MoodModel).filter(MoodModel.user_id == current_user.id).offset(skip).limit(limit).all()  # Filter by current user
        return moods
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{mood_id}")
def read_mood(mood_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
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
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# read mode by date wise from the params with all journals and activities
from datetime import datetime

@router.get("/date/{date}")
def read_mood_by_date(date: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        date_time_obj = datetime.strptime(date, '%Y-%m-%d')
        mood = db.query(MoodModel).filter(MoodModel.user_id == current_user.id, func.date(MoodModel.created_at) == date_time_obj.date()).order_by(MoodModel.created_at.desc()).first()
        if mood:
            mood.journals = db.query(JournalModel).filter(JournalModel.mood_id == mood.id).all()
            mood.activities = db.query(ActivityModel).filter(ActivityModel.mood_id == mood.id).all()
        
        return mood
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{mood_id}")
def update_mood(mood_id: int, mood: MoodCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    try:
        db_mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()  # Ensure the mood belongs to the current user
        if db_mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")

        for key, value in mood.dict(exclude={"journals", "activities"}).items():
            setattr(db_mood, key, value)

        db.commit()
        db.refresh(db_mood)
        return db_mood
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{mood_id}")
def delete_mood(mood_id: int, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    try:
        db_mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()  # Ensure the mood belongs to the current user
        if db_mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")
        db.delete(db_mood)
        db.commit()
        return {"message": "Mood deleted successfully"}
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

#include any one only at a time
@router.patch("/{mood_id}/journal/{id}")
def update_journal_partial(mood_id: int,id: int,journal: JournalBase, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    try:
        db_mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()
        if db_mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")
        db_journal = db.query(JournalModel).filter(JournalModel.mood_id == mood_id,JournalModel.id == id).first()
        if db_journal is None:
            raise HTTPException(status_code=404, detail="Journal not found")
        for key, value in journal.dict().items():
            setattr(db_journal, key, value)
        db.commit()
        db.refresh(db_journal)
        return db_journal
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{mood_id}/activity/{id}")
def update_activity_partial(mood_id: int,id: int,activity: ActivityBase, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    try:
        db_mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()
        if db_mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")
        db_activity = db.query(ActivityModel).filter(ActivityModel.mood_id == mood_id,ActivityModel.id == id).first()
        if db_activity is None:
            raise HTTPException(status_code=404, detail="Activity not found")
        for key, value in activity.dict().items():
            setattr(db_activity, key, value)
        db.commit()
        db.refresh(db_activity)
        return db_activity
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
