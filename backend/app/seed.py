from .database import SessionLocal, engine
from . import models, auth

def seed(clear_db=True):
    if clear_db:
        print("Dropping and recreating all tables...")
        models.Base.metadata.drop_all(bind=engine)
    
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("Starting seed process...")

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

    # 1. Subjects (~15-20)
    subjects = []
    subject_names = [
        "Mathematics", "Physics", "Chemistry", "Biology", "History", 
        "Literature", "Geography", "English", "Geometry", "Physical Education",
        "Philosophy", "Coding", "Art", "Music", "Social Studies", 
        "Foreign Language", "Psychology", "Sociology"
    ]
    for name in subject_names:
        s = models.Subject(name=name)
        db.add(s)
        subjects.append(s)
    db.commit()
    print(f"{len(subject_names)} Subjects seeded.")

    # 2. Teachers (8)
    teachers = []
    teachers_data = [
        "Prof. Sarah Miller", "Dr. James Wilson", "Emily Thompson", "Robert Garcia", 
        "Linda Martinez", "William Chen", "Sophia Davis", "Thomas Taylor"
    ]
    
    import random
    for name in teachers_data:
        availability = []
        # Randomly mark 2-5 slots as busy
        num_busy = random.randint(2, 5)
        while len(availability) < num_busy:
            busy_day = random.randint(0, 4)
            busy_slot = random.randint(0, 7)
            if {"day": busy_day, "slot": busy_slot} not in availability:
                availability.append({"day": busy_day, "slot": busy_slot})
            
        t = models.Teacher(name=name, availability=availability)
        db.add(t)
        teachers.append(t)
    db.commit()
    print(f"{len(teachers_data)} Teachers seeded.")

    # 3. Classes (8: 9A to 12B)
    classes = []
    grades = ["9", "10", "11", "12"]
    sections = ["A", "B"]
    for g in grades:
        for s in sections:
            c = models.SchoolClass(name=f"{g}-{s}")
            db.add(c)
            classes.append(c)
    db.commit()
    print("8 Classes (9A-12B) seeded.")

    # 4. Courses (Initial Assignments/Distributions)
    if teachers and subjects and classes:
        import random
        for cls in classes:
            # Assign 6-8 subjects to each class to create a realistic workload
            num_subjects = random.randint(6, 8)
            selected_subjects = random.sample(subjects, num_subjects)
            for sub in selected_subjects:
                # Assign a random teacher
                teacher = random.choice(teachers)
                course = models.Course(
                    subject_id=sub.id,
                    teacher_id=teacher.id,
                    class_id=cls.id,
                    weekly_hours=random.randint(2, 4)
                )
                db.add(course)
        db.commit()
        print("Initial course distributions seeded.")

    print("Seed process finished successfully!")
    db.close()

if __name__ == "__main__":
    seed()
