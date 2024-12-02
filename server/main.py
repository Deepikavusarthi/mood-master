from fastapi import FastAPI
from server.database import engine, Base
from server.routes.user import router as user_router
from server.routes.mood import router as mood_router
from server.routes.setting import router as setting_router
from server.routes.ai import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allow_headers=["*"],
)


app.include_router(user_router, prefix="/api", tags=["users"])
app.include_router(mood_router, prefix="/api/moods", tags=["moods"])
app.include_router(setting_router, prefix="/api/setting", tags=["setting"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])