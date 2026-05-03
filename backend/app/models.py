from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    subjects = Column(JSON)  # List of subjects they can teach
    availability = Column(JSON)  # List of {day: 0-4, slot: 0-7} when they are BUSY

class SchoolClass(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    weekly_hours = Column(Integer)
    class_id = Column(Integer, ForeignKey("classes.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))

    school_class = relationship("SchoolClass")
    teacher = relationship("Teacher")

class ScheduleEntry(Base):
    __tablename__ = "schedule_entries"
    id = Column(Integer, primary_key=True, index=True)
    day = Column(Integer)  # 0-4 (Mon-Fri)
    slot = Column(Integer) # 0-7 (Hour of day)
    course_id = Column(Integer, ForeignKey("courses.id"))
    
    course = relationship("Course")
