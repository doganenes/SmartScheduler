export type Subject = {
  id: number;
  name: string;
};

export type Teacher = { 
  id: number; 
  name: string; 
  availability?: { day: number; slot: number }[] 
};

export type SchoolClass = { 
  id: number; 
  name: string 
};

export type Course = { 
  id: number; 
  subject_id: number;
  subject: Subject;
  weekly_hours: number; 
  class_id: number; 
  teacher_id: number 
};

export type ScheduleEntry = { 
  id: number; 
  day: number; 
  slot: number; 
  course: Course 
};

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];
