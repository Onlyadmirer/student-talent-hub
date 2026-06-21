import asyncio
import sys
from sqlalchemy import text
from app.db.database import engine

async def run_sql():
    print("Membaca file seed_data.sql...")
    with open("seed_data.sql", "r", encoding="utf-8") as f:
        sql = f.read()

    statements = [s.strip() for s in sql.split(";") if s.strip()]

    async with engine.connect() as conn:
        for i, stmt in enumerate(statements, 1):
            try:
                await conn.execute(text(stmt))
                print(f"  OK ({i}/{len(statements)})")
            except Exception as e:
                print(f"  ERROR ({i}/{len(statements)}): {e}")
                print(f"  Statement: {stmt[:80]}...")
                await conn.rollback()
                return

        await conn.commit()
        print("\nSemua data dummy berhasil di-insert ke database!")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(run_sql())
