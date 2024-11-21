# app/models/user.py
from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger, UniqueConstraint
from server.database import Base
from passlib.context import CryptContext
from sqlalchemy.orm import relationship

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fname = Column(String, index=True)
    lname = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String, unique=True)
    username = Column(String, unique=True)

    moods = relationship("Mood", back_populates="user")
    settings = relationship("Setting", back_populates="user")
    custom_activities = relationship("CustomActivity", back_populates="user")
    rewards = relationship("Reward", back_populates="user")
    
    def verify_password(self, password: str):
        return pwd_context.verify(password, self.password)

    @classmethod
    def hash_password(cls, password: str):
        return pwd_context.hash(password)

## Custom Activity( One to Many)
# id
# user_id - FK
# name
# desc


# ## Reward ( One to One)
# id
# user_id - FK
# mood - number
# activity - number
# journal - number
# strike - number

class CustomActivity(Base):
    __tablename__ = "custom_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    desc = Column(String,nullable=True)
    
    __table_args__ = (UniqueConstraint('user_id', 'name', name='_user_name_uc'),)
    user = relationship("User", back_populates="custom_activities")

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"),index=True,unique=True)
    mood = Column(BigInteger,default=0)
    activity = Column(BigInteger,default=0)
    journal = Column(BigInteger,default=0)
    strike = Column(BigInteger,default=0)

    user = relationship("User", back_populates="rewards")
