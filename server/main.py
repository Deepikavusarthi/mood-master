from fastapi import FastAPI
from server.database import engine, Base
from server.routes.user import router as user_router
from server.routes.mood import router as mood_router
from server.routes.setting import router as setting_router
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router, prefix="/api", tags=["users"])
app.include_router(mood_router, prefix="/api/moods", tags=["moods"])
app.include_router(setting_router, prefix="/api/setting", tags=["setting"])
