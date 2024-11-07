from pydantic import BaseModel
from typing import Optional, List
from datetime import time
class SettingBase(BaseModel):
    anonymous: bool
    strike: int

class Setting(SettingBase):
    id: int

    class Config:
        orm_mode = True
        
class NotificationBase(BaseModel):
    type: str
    flag: bool
    time: time
    day: str

class Notification(NotificationBase):
    id: int

    class Config:
        orm_mode = True

class SettingUpdate(SettingBase):
    anonymous: Optional[bool] = None    
    strike: Optional[int] = None

class NotificationUpdate(NotificationBase):
    type: Optional[str] = None
    flag: Optional[bool] = None
    time: Optional[str] = None
    day: Optional[str] = None

class SettingNotification(SettingBase):
    notification: NotificationBase

    class Config:
        orm_mode = True

class SettingNotificationResponse(BaseModel):
    setting: Setting
    notifications: List[Notification]

