from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.models import user as models
from server.schemas import user as schemas
from server import utils
from server.database import get_db
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

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
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
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
    return db_user

@router.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
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

@router.patch("/users/me/", response_model=schemas.User)
def update_user(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
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

@router.post("/token/refresh/")
def refresh_token(current_user: schemas.User = Depends(get_current_user)):
    access_token = utils.create_access_token(data={"sub": current_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me/", response_model=schemas.User)
def get_user_profile(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@router.delete("/users/me/", response_model=dict)
def delete_user(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted successfully"}