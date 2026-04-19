from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users, auth, roles_dashboard

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(roles_dashboard.router)


@app.get("/health")
def health():
    return {"status": "ok"}