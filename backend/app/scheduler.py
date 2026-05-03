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
        from sqlalchemy.orm import joinedload
        
        # 1. Manage existing schedule
        teacher_busy = set()
        class_busy = set()
        
        if class_id:
            # PARTIAL GENERATION: Only for specific class
            print(f"Generating schedule ONLY for class {class_id}...")
            
            # Identify entries to DELETE (only for this class)
            # We first find the course IDs for this class
            class_course_ids = [c.id for c in self.db.query(models.Course.id).filter(models.Course.class_id == class_id).all()]
            
            # Delete entries for this class
            self.db.query(models.ScheduleEntry)\
                .filter(models.ScheduleEntry.course_id.in_(class_course_ids))\
                .delete(synchronize_session=False)
            self.db.commit() # Commit delete to ensure clean slate for this class
            
            # Identify OTHER classes' entries to mark as busy (to avoid teacher/class conflicts)
            other_entries = self.db.query(models.ScheduleEntry)\
                .options(joinedload(models.ScheduleEntry.course))\
                .all()
            
            for entry in other_entries:
                if entry.course:
                    teacher_busy.add((entry.day, entry.slot, entry.course.teacher_id))
                    class_busy.add((entry.day, entry.slot, entry.course.class_id))
            
            # Only get courses for this specific class to place
            courses = self.db.query(models.Course).filter(models.Course.class_id == class_id).all()
        else:
            # FULL GENERATION: Clear everything
            print("Generating FULL school schedule...")
            self.db.query(models.ScheduleEntry).delete()
            self.db.commit()
            courses = self.db.query(models.Course).all()
        
        # 2. Add teacher busy slots from their availability (global constraints)
        teachers = self.db.query(models.Teacher).all()
        for t in teachers:
            if t.availability:
                for slot in t.availability:
                    teacher_busy.add((slot['day'], slot['slot'], t.id))
        
        # 3. Placement process
        schedule_entries = []
        # Shuffle courses to ensure variety in placement
        random.shuffle(courses)
        
        all_slots = []
        for day in range(self.days):
            for slot in range(self.slots_per_day):
                all_slots.append((day, slot))
        
        for course in courses:
            hours_to_place = course.weekly_hours
            placed_hours = 0
            
            # Try to find empty slots
            course_slots = all_slots.copy()
            random.shuffle(course_slots)
            
            for day, slot in course_slots:
                if placed_hours >= hours_to_place:
                    break
                
                # Check teacher conflict (across ALL classes)
                if (day, slot, course.teacher_id) in teacher_busy:
                    continue
                
                # Check class conflict
                if (day, slot, course.class_id) in class_busy:
                    continue
                
                # SUCCESS: Place the hour
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
                print(f"CRITICAL: Could not place {hours_to_place - placed_hours} hours for {course.subject.name} in class {course.class_id}")
                # We could raise an error here or just log it
                
        # 4. Save to DB
        self.db.add_all(schedule_entries)
        self.db.commit()
        return True
