from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from . import models
import random

class Scheduler:
    def __init__(self, db: Session):
        self.db = db
        self.days = 5  # Mon-Fri
        self.slots_per_day = 8 # 8 hours per day
        
    def generate_timetable(self, class_id: Optional[int] = None):
        # 1. Manage existing schedule
        teacher_busy = set()
        class_busy = set()
        
        if class_id:
            # PARTIAL GENERATION: Only for specific class
            # Clear entries for this class only
            self.db.query(models.ScheduleEntry)\
                .filter(models.ScheduleEntry.course.has(class_id=class_id))\
                .delete(synchronize_session=False)
            
            # Identify other classes' entries to mark as busy
            existing_entries = self.db.query(models.ScheduleEntry).all()
            for entry in existing_entries:
                teacher_busy.add((entry.day, entry.slot, entry.course.teacher_id))
                class_busy.add((entry.day, entry.slot, entry.course.class_id))
            
            # Only get courses for this specific class
            courses = self.db.query(models.Course).filter(models.Course.class_id == class_id).all()
        else:
            # FULL GENERATION: Clear everything
            self.db.query(models.ScheduleEntry).delete()
            courses = self.db.query(models.Course).all()
        
        # 2. Add teacher busy slots from their availability (global constraints)
        teachers = self.db.query(models.Teacher).all()
        for t in teachers:
            if t.availability:
                for slot in t.availability:
                    teacher_busy.add((slot['day'], slot['slot'], t.id))

        # 3. Placement process
        schedule_entries = []
        random.shuffle(courses)
        
        all_slots = []
        for day in range(self.days):
            for slot in range(self.slots_per_day):
                all_slots.append((day, slot))
        
        for course in courses:
            hours_to_place = course.weekly_hours
            placed_hours = 0
            
            course_slots = all_slots.copy()
            random.shuffle(course_slots)
            
            for day, slot in course_slots:
                if placed_hours >= hours_to_place:
                    break
                
                # Constraints
                if (day, slot, course.teacher_id) in teacher_busy:
                    continue
                if (day, slot, course.class_id) in class_busy:
                    continue
                
                # Place
                teacher_busy.add((day, slot, course.teacher_id))
                class_busy.add((day, slot, course.class_id))
                
                new_entry = models.ScheduleEntry(
                    day=day,
                    slot=slot,
                    course_id=course.id
                )
                schedule_entries.append(new_entry)
                placed_hours += 1
            
            if placed_hours < hours_to_place:
                print(f"Warning: Could not place all hours for course {course.name} in class {course.class_id}")

        # 4. Save to DB
        self.db.add_all(schedule_entries)
        self.db.commit()
        return True
