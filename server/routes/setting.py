
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.setting import Setting, Notification, SettingBase, SettingUpdate, NotificationUpdate, NotificationBase, SettingNotification, SettingNotificationResponse
from server.models.setting import Setting as SettingModel, Notification as NotificationModel    
from server.routes.auth import get_current_user
from server.models.user import User
router = APIRouter()
from datetime import time


@router.get("/")
def get_setting(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db_setting = db.query(SettingModel).filter(SettingModel.user_id == current_user.id).first()  # Ensure the setting belongs to the current user
        if db_setting is None:
            raise HTTPException(status_code=404, detail="Setting not found")
        
        return {
            "setting": {"id": db_setting.id, "anonymous": db_setting.anonymous, "strike": db_setting.strike},
            "notifications": db_setting.notification
        }
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
def create_setting(setting: SettingNotification, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # db.query(SettingModel).filter(SettingModel.user_id == current_user.id).delete()
        if db.query(SettingModel).filter(SettingModel.user_id == current_user.id).first() is not None:
            raise HTTPException(status_code=400, detail="Setting already exists")
        db_setting = SettingModel(
            user_id=current_user.id,
            anonymous=setting.anonymous,
            strike=setting.strike,
        )
        db.add(db_setting)
        db.commit()
        db_notification = NotificationModel(
            setting_id=db_setting.id,
            type=setting.notification.type,
            flag=setting.notification.flag,
            time=setting.notification.time,
            day=setting.notification.day,
        )
        db.add(db_notification)
        
        db.commit()
        response = {
            "setting": {
                "id": db_setting.id,
                "anonymous": db_setting.anonymous,
                "strike": db_setting.strike
            },
            "notification": {
                "id": db_notification.id,
                "type": db_notification.type,
                "flag": db_notification.flag,
                "time": db_notification.time,
                "day": db_notification.day
            }
        }
        return response
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/", response_model=Setting)
def update_setting(setting: SettingUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db_setting = db.query(SettingModel).filter(SettingModel.user_id == current_user.id).first()
        if db_setting is None:
            raise HTTPException(status_code=404, detail="Setting not found")
        db_setting.anonymous = setting.anonymous if setting.anonymous is not None else db_setting.anonymous
        db_setting.strike = setting.strike if setting.strike is not None else db_setting.strike
        db.commit()
        return db_setting
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/notification", response_model=List[Notification])
def get_notification(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db_setting = db.query(SettingModel).filter(SettingModel.user_id == current_user.id).first()
        if db_setting is None:
            raise HTTPException(status_code=404, detail="Setting not found")
        db_notification = db.query(NotificationModel).filter(NotificationModel.setting_id == db_setting.id)
        return db_notification
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/notification",response_model=List[Notification])
def create_notification(notification: List[NotificationBase], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        if len(notification) == 0:
            raise HTTPException(status_code=400, detail="Notification is empty")
        db_setting = db.query(SettingModel).filter(SettingModel.user_id == current_user.id).first()
        
        if db_setting is None:
            raise HTTPException(status_code=404, detail="Setting not found")
        db.query(NotificationModel).filter(NotificationModel.setting_id == db_setting.id).delete()
        db_notifications = []
        for i in notification:
            if db.query(NotificationModel).filter(NotificationModel.setting_id == db_setting.id, NotificationModel.type == i.type).first() is not None:
                continue
            db_notification = NotificationModel(
                setting_id=db_setting.id,
                type=i.type,
                flag=i.flag,
                time=i.time,
                day=i.day,
            )
            db_notifications.append(db_notification)
        db.add_all(db_notifications)
        db.commit()
        return db_notifications  
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/notification/{id}", response_model=Notification)
def update_notification(id: int, notification: NotificationUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db_setting = db.query(SettingModel).filter(SettingModel.user_id == current_user.id).first()
        if db_setting is None:
            raise HTTPException(status_code=404, detail="Setting not found")    
        db_notification = db.query(NotificationModel).filter(NotificationModel.setting_id == db_setting.id, NotificationModel.id == id).first()
        if db_notification is None:
            raise HTTPException(status_code=404, detail="Notification not found")
        db_notification.type = notification.type if notification.type is not None else db_notification.type
        db_notification.flag = notification.flag if notification.flag is not None else db_notification.flag
        db_notification.time = notification.time if notification.time is not None else db_notification.time
        db_notification.day = notification.day if notification.day is not None else db_notification.day
        db.commit()
        return db_notification 
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
