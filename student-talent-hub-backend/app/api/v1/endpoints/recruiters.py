from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.api.dependencies import get_db, get_current_user
from app.schemas.user import UserResponse
from app.schemas.skill import UserSkillWithCategoryResponse
from app.crud import crud_skill
from app.models.user import User
from app.models.skill import UserSkill
from app.models.saved_student import SavedStudent
from app.models.project import Project
from app.models.endorsement import Endorsement

router = APIRouter()

async def require_recruiter(current_user: User = Depends(get_current_user)):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can access this endpoint")
    return current_user

@router.get("/dashboard")
async def recruiter_dashboard(
    db: AsyncSession = Depends(get_db),
    recruiter: User = Depends(require_recruiter),
):
    total_saved = (await db.execute(
        select(func.count(SavedStudent.id)).where(SavedStudent.recruiter_id == recruiter.id)
    )).scalar_one()

    total_endorsements_given = (await db.execute(
        select(func.count(Endorsement.id)).where(Endorsement.from_user_id == recruiter.id)
    )).scalar_one()

    recent_saved = (
        (await db.execute(
            select(SavedStudent)
            .options(selectinload(SavedStudent.student))
            .where(SavedStudent.recruiter_id == recruiter.id)
            .order_by(SavedStudent.created_at.desc())
            .limit(5)
        )).scalars().all()
    )

    total_students = (await db.execute(
        select(func.count(User.id)).where(User.role == "student", User.status == "active")
    )).scalar_one()

    return {
        "total_saved": total_saved,
        "total_endorsements_given": total_endorsements_given,
        "total_students": total_students,
        "recent_saved": [
            {
                "id": ss.student.id,
                "name": ss.student.name,
                "email": ss.student.email,
                "nim": ss.student.nim,
                "major": ss.student.major,
                "role": ss.student.role,
                "status": ss.student.status,
            }
            for ss in recent_saved
        ],
    }

@router.get("/students", response_model=List[dict])
async def recruiter_list_students(
    major: Optional[str] = None,
    skill_id: Optional[int] = None,
    proficiency_level: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    recruiter: User = Depends(require_recruiter),
):
    query = select(User).where(User.role == "student", User.status == "active")
    if major:
        query = query.where(User.major.ilike(f"%{major}%"))
    if skill_id:
        query = query.where(
            User.id.in_(
                select(UserSkill.user_id).where(UserSkill.skill_id == skill_id)
            )
        )
    if proficiency_level:
        query = query.where(
            User.id.in_(
                select(UserSkill.user_id).where(UserSkill.proficiency_level == proficiency_level)
            )
        )
    result = await db.execute(query.order_by(User.name))
    students = result.scalars().all()

    saved_ids = set()
    if students:
        saved_result = await db.execute(
            select(SavedStudent.student_id).where(
                SavedStudent.recruiter_id == recruiter.id,
                SavedStudent.student_id.in_([s.id for s in students]),
            )
        )
        saved_ids = {row[0] for row in saved_result.all()}

    result_list = []
    for s in students:
        result_list.append({
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "nim": s.nim,
            "major": s.major,
            "role": s.role,
            "status": s.status,
            "bio": s.bio,
            "profile_picture": s.profile_picture,
            "is_saved": s.id in saved_ids,
        })
    return result_list

@router.get("/saved-students", response_model=List[UserResponse])
async def recruiter_saved_students(
    db: AsyncSession = Depends(get_db),
    recruiter: User = Depends(require_recruiter),
):
    result = await db.execute(
        select(SavedStudent)
        .options(selectinload(SavedStudent.student))
        .where(SavedStudent.recruiter_id == recruiter.id)
        .order_by(SavedStudent.created_at.desc())
    )
    saved = result.scalars().all()
    return [ss.student for ss in saved if ss.student]

@router.post("/saved-students/{student_id}", status_code=status.HTTP_201_CREATED)
async def recruiter_save_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    recruiter: User = Depends(require_recruiter),
):
    student = await db.execute(select(User).where(User.id == student_id, User.role == "student"))
    student = student.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    existing = await db.execute(
        select(SavedStudent).where(
            SavedStudent.recruiter_id == recruiter.id,
            SavedStudent.student_id == student_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Student already saved")

    db_saved = SavedStudent(recruiter_id=recruiter.id, student_id=student_id)
    db.add(db_saved)
    await db.commit()
    return {"message": "Student saved successfully"}

@router.delete("/saved-students/{student_id}")
async def recruiter_unsave_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    recruiter: User = Depends(require_recruiter),
):
    result = await db.execute(
        select(SavedStudent).where(
            SavedStudent.recruiter_id == recruiter.id,
            SavedStudent.student_id == student_id,
        )
    )
    db_saved = result.scalar_one_or_none()
    if not db_saved:
        raise HTTPException(status_code=404, detail="Student not in saved list")

    await db.delete(db_saved)
    await db.commit()
    return {"message": "Student unsaved successfully"}

@router.get("/students/{student_id}/skills", response_model=List[UserSkillWithCategoryResponse])
async def recruiter_student_skills(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    recruiter: User = Depends(require_recruiter),
):
    student = await db.execute(select(User).where(User.id == student_id, User.role == "student"))
    if not student.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Student not found")
    return await crud_skill.get_user_skills_with_category(db, student_id)
