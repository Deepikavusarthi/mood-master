from fastapi import APIRouter, Depends, HTTPException, status
import google.generativeai as genai
import os
from server.models.mood import Mood as MoodModel, Journal as JournalModel, Activity as ActivityModel
from server.database import get_db
from server.routes.auth import get_current_user
from server.models.user import User
from sqlalchemy.orm import Session

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_ai_insights(mood_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print("Generating AI insights...", mood_id)
    mood = db.query(MoodModel).filter(MoodModel.id == mood_id, MoodModel.user_id == current_user.id).first()
    if not mood:
        raise HTTPException(status_code=404, detail="Mood not found")
    
    # Enhanced context with more detailed and structured information
    context_details = {
        "user_profile": {
            "username": current_user.username,
            "age": current_user.age if hasattr(current_user, 'age') else "Not specified",
            "gender": current_user.gender if hasattr(current_user, 'gender') else "Not specified"
        },
        "mood_details": {
            "mood_type": mood.mood_type,
            "intensity": mood.mood_intensity if hasattr(mood, 'mood_intensity') else "Not specified",
            "date": mood.created_at.strftime("%Y-%m-%d %H:%M:%S")
        },
        "journals": [
            {
                "text": journal.text,
                "tags": journal.tags if hasattr(journal, 'tags') else [],
                "sentiment": journal.sentiment if hasattr(journal, 'sentiment') else "Unanalyzed"
            } for journal in mood.journals
        ],
        "activities": [
            {
                "name": activity.name,
                "type": activity.type,
                "duration": activity.duration,
                "quality": activity.quality,
                "quantity": activity.quantity,
                "gain": activity.gain,
                "time_of_day": activity.time_of_day if hasattr(activity, 'time_of_day') else "Not specified"
            } for activity in mood.activities
        ]
    }
    
    # Construct a more comprehensive prompt
    user_input = f"""
    Provide personalized mental health insights based on the following comprehensive user context:

    User Profile:
    - Username: {context_details['user_profile']['username']}
    - Age: {context_details['user_profile']['age']}
    - Gender: {context_details['user_profile']['gender']}

    Mood Assessment:
    - Mood Type: {context_details['mood_details']['mood_type']}
    - Mood Intensity: {context_details['mood_details']['intensity']}
    - Date: {context_details['mood_details']['date']}

    Journal Entries:
    {context_details['journals']}

    Daily Activities:
    {context_details['activities']}


    Please provide:
    1. Personalized mental health insights
    2. Positive reinforcement for good habits
    3. Constructive suggestions for improvement
    4. Motivational encouragement
     Provide concise, personalized insights that motivate and guide.
     Highlight strengths and suggest minimal, actionable improvements if needed and in very short sentences in 2-3 lines.
    """
    
    try:
        response = model.generate_content(user_input)
        print("AI Insights Generated Successfully")
        return response.text
    except Exception as e:
        print(f"Error generating insights: {e}")
        return f"Unable to generate insights. Error: {str(e)}"

@router.post("/insights/{mood_id}")
def update_ai_insights_route(mood_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ai_insights = generate_ai_insights(mood_id, current_user, db)
    
    # Update mood with AI insights
    mood_update = db.query(MoodModel).filter(
        MoodModel.id == mood_id, 
        MoodModel.user_id == current_user.id
    ).update(
        {"ai_insights": ai_insights}, 
        synchronize_session="fetch"
    )
    
    db.commit()
    
    return {"ai_insights": ai_insights}
