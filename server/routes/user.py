from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from server.models import user as models
from server.schemas import user as schemas
from server import utils
from server.database import get_db
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import time
from server.routes.auth import get_current_user
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = models.User(
            fname=user.fname,
            lname=user.lname,
            email=user.email,
            password=utils.get_password_hash(user.password),  # Hash the password
            phone=user.phone,
            username=user.username
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        db_setting = models.Setting(
            user_id=db_user.id,
            anonymous=False,
            strike=0
        )
        db.add(db_setting)
        db.commit()
        db.refresh(db_setting)
        db_notification = models.Notification(
            setting_id=db_setting.id,
            type="Daily",
            flag=True,
            time=time(18, 0, 0),
            day="None"
        )   
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        db_reward = models.Reward(
            user_id=db_user.id,
            mood=0,
            activity=0,
            journal=0,
            strike=0
        )
        db.add(db_reward)
        db.commit()
        db.refresh(db_reward)
        return db_user
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="User already exists")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        # Check if the user exists by username or email
        db_user = (
            db.query(models.User)
            .filter((models.User.username == user.username) | (models.User.email == user.username))
            .first()
        )
        
        if not db_user or not db_user.verify_password(user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = utils.create_access_token(data={"sub": db_user.username})
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.patch("/users/me/", response_model=schemas.User)
def update_user(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
        
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Check for existing username or phone
        if user_update.username and db.query(models.User).filter(models.User.username == user_update.username).first():
            raise HTTPException(status_code=400, detail="Username already exists")
        
        if user_update.phone and db.query(models.User).filter(models.User.phone == user_update.phone).first():
            raise HTTPException(status_code=400, detail="Phone number already exists")

        # Update user details
        if user_update.fname is not None:
            db_user.fname = user_update.fname
        if user_update.lname is not None:
            db_user.lname = user_update.lname
        if user_update.username is not None:
            db_user.username = user_update.username
        if user_update.phone is not None:
            db_user.phone = user_update.phone

        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/token/refresh/")
def refresh_token(current_user: schemas.User = Depends(get_current_user)):
    try:
        access_token = utils.create_access_token(data={"sub": current_user.username})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/users/me/", response_model=schemas.User)
def get_user_profile(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@router.delete("/users/me/", response_model=dict)
def delete_user(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
        
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        db.delete(db_user)
        db.commit()
        return {"detail": "User deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/users/custom_activity/", response_model=list[schemas.CustomActivity])
def get_custom_activity(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        return db.query(models.CustomActivity).filter(models.CustomActivity.user_id == current_user.id).all()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/users/custom_activity/", response_model=schemas.CustomActivity)
def create_custom_activity(custom_activity: schemas.CustomActivityBase, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        db_custom_activity = models.CustomActivity(
            user_id=current_user.id,
            name=custom_activity.name,
            desc=custom_activity.desc
        )
        db.add(db_custom_activity)
        db.commit()
        db.refresh(db_custom_activity)
        return db_custom_activity
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Custom activity name already exists")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/users/custom_activity/{custom_activity_id}", response_model=schemas.UpdateCustomActivity)
def update_custom_activity(custom_activity_id: int, custom_activity: schemas.UpdateCustomActivity, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        db_custom_activity = db.query(models.CustomActivity).filter(models.CustomActivity.id == custom_activity_id, models.CustomActivity.user_id == current_user.id).first()
        if not db_custom_activity:
            raise HTTPException(status_code=404, detail="Custom activity not found")
        
        db_custom_activity.name = custom_activity.name if custom_activity.name is not None else db_custom_activity.name
        db_custom_activity.desc = custom_activity.desc if custom_activity.desc is not None else db_custom_activity.desc
        db.commit()
        db.refresh(db_custom_activity)
        return db_custom_activity
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/users/custom_activity/{custom_activity_id}", response_model=dict)
def delete_custom_activity(custom_activity_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        db_custom_activity = db.query(models.CustomActivity).filter(models.CustomActivity.id == custom_activity_id, models.CustomActivity.user_id == current_user.id).first()
        if not db_custom_activity:
            raise HTTPException(status_code=404, detail="Custom activity not found")
        
        db.delete(db_custom_activity)
        db.commit()
        return {"detail": "Custom activity deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/users/reward/", response_model=schemas.Reward)
def get_reward(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        db_reward = db.query(models.Reward).filter(models.Reward.user_id == current_user.id).first()
        if not db_reward:
            raise HTTPException(status_code=404, detail="Reward not found")
        return db_reward
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print("Get Reward Error: ", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/users/reward/", response_model=schemas.Reward)
def create_reward(reward: schemas.RewardBase, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    try:
        db_reward = models.Reward(
            user_id=current_user.id,
            mood=reward.mood,
            activity=reward.activity,
            journal=reward.journal,
            strike=reward.strike
        )
        db.add(db_reward)
        db.commit()
        db.refresh(db_reward)
        return db_reward
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

# @router.patch("/users/reward/", response_model=schemas.UpdateReward)
# def update_reward(reward: schemas.UpdateReward, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
#     try:
#         db_reward = db.query(models.Reward).filter(models.Reward.user_id == current_user.id).first()
#         if not db_reward:
#             raise HTTPException(status_code=404, detail="Reward not found")
        
#         db_reward.mood = reward.mood if reward.mood is not None else db_reward.mood
#         db_reward.activity = reward.activity if reward.activity is not None else db_reward.activity
#         db_reward.journal = reward.journal if reward.journal is not None else db_reward.journal
#         db_reward.strike = reward.strike if reward.strike is not None else db_reward.strike
#         db.commit()
#         db.refresh(db_reward)
#         return db_reward
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail="Internal Server Error")


