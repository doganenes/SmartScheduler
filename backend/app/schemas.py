from pydantic import BaseModel
from typing import List, Optional, Dict

class TeacherBase(BaseModel):
    name: str
    subjects: List[str]
    availability: Optional[List[Dict[str, int]]] = []

class TeacherCreate(TeacherBase):
    pass

class Teacher(TeacherBase):
    id: int
    class Config:
        from_attributes = True

class ClassBase(BaseModel):
    name: str

class ClassCreate(ClassBase):
    pass

class Class(ClassBase):
    id: int
    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    name: str
    weekly_hours: int
    class_id: int
    teacher_id: int

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    class Config:
        from_attributes = True

class ScheduleEntryBase(BaseModel):
    day: int
    slot: int
    course_id: int

class ScheduleEntry(ScheduleEntryBase):
    id: int
    course: Course
    class Config:
        from_attributes = True
