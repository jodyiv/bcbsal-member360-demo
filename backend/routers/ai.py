from fastapi import APIRouter
from pydantic import BaseModel, Field
from services.ai_service import generate_insight

router = APIRouter(tags=["ai"])

class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    member_id: str = Field("MBR-JS-0042")

@router.post("/ask")
def ask_ai(req: AskRequest):
    return generate_insight(req.question, req.member_id)

@router.get("/models")
def list_models():
    return [
        {
            "id": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
            "label": "Llama 4 Maverick (Default · Multimodal)",
            "default": True
        },
        {
            "id": "ibm/granite-3-3-8b-instruct",
            "label": "IBM Granite 3.3 8B Instruct",
            "default": False
        }
    ]
