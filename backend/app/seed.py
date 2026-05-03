from .database import SessionLocal, engine
from . import models

def seed():
    db = SessionLocal()
    # Check if data already exists
    if db.query(models.Teacher).first():
        print("Data already exists, skipping seed.")
        return

    # 1. Teachers
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
        # Give every teacher some random busy slots (2-4 slots) to avoid "Always Available"
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

    # 2. Classes (2 sections for each grade)
    grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"]
    sections = ["A", "B"]
    school_classes = []
    
    for g in grades:
        for s in sections:
            c = models.SchoolClass(name=f"{g}-{s}")
            db.add(c)
            school_classes.append(c)
    
    db.commit()

    # 3. Courses
    # Assign some standard courses to each class
    for c in school_classes:
        # Math (4 hours)
        db.add(models.Course(name="Mathematics", weekly_hours=4, class_id=c.id, teacher_id=teachers[0].id if c.name.endswith("A") else teachers[7].id))
        # Literature (4 hours)
        db.add(models.Course(name="Literature", weekly_hours=4, class_id=c.id, teacher_id=teachers[5].id))
        # History or Geography (2 hours)
        db.add(models.Course(name="History" if "9" in c.name or "11" in c.name else "Geography", 
                            weekly_hours=2, class_id=c.id, 
                            teacher_id=teachers[4].id if "9" in c.name or "11" in c.name else teachers[6].id))
        
        # Science subjects based on grade
        if "9" in c.name or "10" in c.name:
            db.add(models.Course(name="Physics", weekly_hours=2, class_id=c.id, teacher_id=teachers[1].id))
            db.add(models.Course(name="Chemistry", weekly_hours=2, class_id=c.id, teacher_id=teachers[2].id))
            db.add(models.Course(name="Biology", weekly_hours=2, class_id=c.id, teacher_id=teachers[3].id))
        else:
            # Specialization in Grade 11-12
            db.add(models.Course(name="Advanced Physics", weekly_hours=4, class_id=c.id, teacher_id=teachers[7].id))
            db.add(models.Course(name="Advanced Chemistry", weekly_hours=4, class_id=c.id, teacher_id=teachers[9].id))

    db.commit()
    print("Seed completed successfully with 8 classes and 10 teachers!")

if __name__ == "__main__":
    seed()
