from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, scheduler, seed
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Timetable Scheduler API")

@app.on_event("startup")
def on_startup():
    seed.seed()

# CORS setup
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Timetable Scheduler API is running"}

# --- Teachers ---
@app.get("/teachers/", response_model=List[schemas.Teacher])
def get_teachers(db: Session = Depends(get_db)):
    return db.query(models.Teacher).all()

@app.post("/teachers/", response_model=schemas.Teacher)
def create_teacher(teacher: schemas.TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = models.Teacher(**teacher.model_dump())
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@app.put("/teachers/{teacher_id}", response_model=schemas.Teacher)
def update_teacher(teacher_id: int, teacher: schemas.TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    for key, value in teacher.model_dump().items():
        setattr(db_teacher, key, value)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@app.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    db_teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(db_teacher)
    db.commit()
    return {"message": "Teacher deleted"}

# --- Classes ---
@app.get("/classes/", response_model=List[schemas.Class])
def get_classes(db: Session = Depends(get_db)):
    return db.query(models.SchoolClass).all()

@app.post("/classes/", response_model=schemas.Class)
def create_class(cls: schemas.ClassCreate, db: Session = Depends(get_db)):
    db_class = models.SchoolClass(**cls.model_dump())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@app.put("/classes/{class_id}", response_model=schemas.Class)
def update_class(class_id: int, cls: schemas.ClassCreate, db: Session = Depends(get_db)):
    db_class = db.query(models.SchoolClass).filter(models.SchoolClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db_class.name = cls.name
    db.commit()
    db.refresh(db_class)
    return db_class

@app.delete("/classes/{class_id}")
def delete_class(class_id: int, db: Session = Depends(get_db)):
    db_class = db.query(models.SchoolClass).filter(models.SchoolClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(db_class)
    db.commit()
    return {"message": "Class deleted"}

# --- Courses ---
@app.get("/courses/", response_model=List[schemas.Course])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@app.post("/courses/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.put("/courses/{course_id}", response_model=schemas.Course)
def update_course(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    for key, value in course.model_dump().items():
        setattr(db_course, key, value)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted"}

# Scheduler Endpoints
@app.post("/scheduler/generate")
def generate_schedule(class_id: int = None, db: Session = Depends(get_db)):
    s = scheduler.Scheduler(db)
    success = s.generate_timetable(class_id=class_id)
    if success:
        return {"message": "Schedule generated successfully"}
    raise HTTPException(status_code=500, detail="Failed to generate schedule")

@app.get("/scheduler/view", response_model=List[schemas.ScheduleEntry])
def get_schedule(db: Session = Depends(get_db)):
    return db.query(models.ScheduleEntry).all()

@app.put("/scheduler/move/{entry_id}")
def move_lesson(entry_id: int, day: int, slot: int, db: Session = Depends(get_db)):
    entry = db.query(models.ScheduleEntry).filter(models.ScheduleEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    
    # Optional: Add collision checks here if needed
    entry.day = day
    entry.slot = slot
    db.commit()
    return {"message": "Lesson moved successfully"}
