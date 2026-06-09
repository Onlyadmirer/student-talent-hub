import asyncio
import sys
import logging
from sqlalchemy import delete
from app.db.database import SessionLocal, engine
from app.models.user import User
from app.models.skill import SkillCategory, UserSkill
from app.models.project import Project, ProjectContributor
from app.models.endorsement import Endorsement
from app.core.security import get_password_hash

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def clean_up(session):
    # Delete in reverse order of dependencies to avoid foreign key constraints errors
    await session.execute(delete(Endorsement))
    await session.execute(delete(ProjectContributor))
    await session.execute(delete(Project))
    await session.execute(delete(UserSkill))
    await session.execute(delete(User))
    await session.execute(delete(SkillCategory))
    await session.commit()

async def seed_data():
    logger.info("Starting database seeding...")
    async with SessionLocal() as session:
        try:
            logger.info("Cleaning up existing data...")
            await clean_up(session)

            # 1. Skill Categories
            logger.info("Seeding skill_categories...")
            skills = [
                SkillCategory(name="Web Development", description="Frontend and Backend web development"),
                SkillCategory(name="Mobile Development", description="Android and iOS development"),
                SkillCategory(name="UI/UX Design", description="User Interface and User Experience Design"),
                SkillCategory(name="QA Testing", description="Quality Assurance and Testing"),
                SkillCategory(name="Data Science", description="Data Analysis, Machine Learning, and AI")
            ]
            session.add_all(skills)
            await session.flush() # Flush to assign IDs

            # 2. Users
            logger.info("Seeding users...")
            pwd_hash = get_password_hash("password123")
            users = [
                User(email="admin@example.com", hashed_password=pwd_hash, name="Admin User", role="admin", status="active"),
                User(email="student1@example.com", hashed_password=pwd_hash, nim="1001", name="Student One", role="student", status="active"),
                User(email="student2@example.com", hashed_password=pwd_hash, nim="1002", name="Student Two", role="student", status="active"),
                User(email="student3@example.com", hashed_password=pwd_hash, nim="1003", name="Student Three", role="student", status="active"),
                User(email="recruiter@example.com", hashed_password=pwd_hash, name="Recruiter User", role="recruiter", status="active")
            ]
            session.add_all(users)
            await session.flush()

            # 3. User Skills
            logger.info("Seeding user_skills...")
            user_skills = [
                UserSkill(user_id=users[1].id, skill_id=skills[0].id, proficiency_level="expert"),
                UserSkill(user_id=users[1].id, skill_id=skills[2].id, proficiency_level="intermediate"),
                UserSkill(user_id=users[2].id, skill_id=skills[1].id, proficiency_level="expert"),
                UserSkill(user_id=users[3].id, skill_id=skills[0].id, proficiency_level="beginner"),
                UserSkill(user_id=users[3].id, skill_id=skills[3].id, proficiency_level="intermediate")
            ]
            session.add_all(user_skills)
            await session.flush()

            # 4. Projects
            logger.info("Seeding projects...")
            projects = [
                Project(title="Student Talent Hub", description="A platform to connect students with recruiters.", is_open=True, status="published", owner_id=users[1].id),
                Project(title="Mobile E-commerce App", description="A mobile app for online shopping.", is_open=False, status="published", owner_id=users[2].id),
                Project(title="Portfolio Website", description="Personal portfolio website.", is_open=True, status="published", owner_id=users[3].id)
            ]
            session.add_all(projects)
            await session.flush()

            # 5. Project Contributors
            logger.info("Seeding project_contributors...")
            contributors = [
                ProjectContributor(user_id=users[1].id, project_id=projects[0].id, role="Backend Developer"),
                ProjectContributor(user_id=users[2].id, project_id=projects[0].id, role="Frontend Developer"),
                ProjectContributor(user_id=users[3].id, project_id=projects[1].id, role="QA Engineer"),
                ProjectContributor(user_id=users[1].id, project_id=projects[1].id, role="Mobile Developer")
            ]
            session.add_all(contributors)
            await session.flush()

            # 6. Endorsements
            logger.info("Seeding endorsements...")
            endorsements = [
                Endorsement(from_user_id=users[2].id, to_user_id=users[1].id, skill_id=skills[0].id, project_id=projects[0].id, message="Great backend work on the Hub!"),
                Endorsement(from_user_id=users[1].id, to_user_id=users[2].id, skill_id=skills[2].id, project_id=projects[0].id, message="Awesome UI/UX implementation."),
                Endorsement(from_user_id=users[4].id, to_user_id=users[1].id, skill_id=skills[0].id, project_id=None, message="Impressed with your Web Dev skills.")
            ]
            session.add_all(endorsements)
            
            await session.commit()
            logger.info("Database seeding completed successfully!")

        except Exception as e:
            logger.error(f"An error occurred during seeding: {e}")
            logger.error("Rolling back all changes.")
            await session.rollback()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(seed_data())