
# ## settings ( One to One)
# id 
# user_id - FK
# anonymous - boolean
# strike - Number


# ## Notification ( One to One)
# id
# settings_id - FK
# type ( Daily, Weekly, Monthly)
# flag - boolean
# time - time
# day - day

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, Boolean, Time, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base
from datetime import datetime,time

class Setting(Base):
    __tablename__ = 'settings'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id',ondelete='CASCADE'),unique=True,index=True)
    anonymous = Column(Boolean,default=False)
    strike = Column(Integer,default=0)

    user = relationship("User", back_populates="settings")
    notification = relationship("Notification", back_populates="setting")
class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    setting_id = Column(Integer, ForeignKey('settings.id',ondelete='CASCADE'),index=True)
    type = Column(String(20),default="Daily")
    flag = Column(Boolean,default=True)
    time = Column(Time,default=time(18, 0, 0)) # 10:00:00 
    day = Column(String(14),default="N") # Monday

    #setting_id and type is unique
    __table_args__ = (UniqueConstraint('setting_id', 'type', name='_setting_type_uc'),)
    
    setting = relationship("Setting", back_populates="notification")
