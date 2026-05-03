from .database import SessionLocal, engine
from . import models, auth

def seed():
    db = SessionLocal()
    print("Forcing seed process...")

    # 0. Admin User - Create or Update
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin:
        admin = models.User(
            username="admin",
            hashed_password=auth.get_password_hash("admin1234"),
            role=models.UserRole.ADMIN
        )
        db.add(admin)
        print("Admin created: admin / admin1234")
    else:
        admin.hashed_password = auth.get_password_hash("admin1234")
        admin.role = models.UserRole.ADMIN
        print("Admin password reset to: admin1234")
    
    db.commit()

    # 1. Teachers
    if not db.query(models.Teacher).first():
        teachers_data = [
            ("John Smith", ["Mathematics"]),
            ("Alice Brown", ["Physics"]),
            ("Michael Green", ["Chemistry"]),
            ("Sarah Wilson", ["Biology"]),
            ("Robert Taylor", ["History"]),
            ("Emma Davis", ["Literature"]),
            ("David Miller", ["Geography"]),
            ("James Wilson", ["Mathematics"]),
            ("Linda Anderson", ["English"]),
            ("William Martin", ["Science"])
        ]
        
        teachers = []
        import random
        for i, (name, subjects) in enumerate(teachers_data):
            availability = []
            num_busy = random.randint(2, 4)
            while len(availability) < num_busy:
                busy_day = random.randint(0, 4)
                busy_slot = random.randint(0, 7)
                if {"day": busy_day, "slot": busy_slot} not in availability:
                    availability.append({"day": busy_day, "slot": busy_slot})
                
            t = models.Teacher(name=name, subjects=subjects, availability=availability)
            db.add(t)
            teachers.append(t)
        db.commit()
        print("Teachers seeded.")

    # 2. Classes
    if not db.query(models.SchoolClass).first():
        grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"]
        sections = ["A", "B"]
        for g in grades:
            for s in sections:
                c = models.SchoolClass(name=f"{g}-{s}")
                db.add(c)
        db.commit()
        print("Classes seeded.")

    print("Seed process finished successfully!")
    db.close()

if __name__ == "__main__":
    seed()
