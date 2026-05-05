import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, GraduationCap, Mail, Phone, 
  BookOpen, Calendar, Clock, X, Check, AlertCircle, ChevronRight,
  MoreVertical, UserPlus, Filter, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Teacher, Course, Subject, SchoolClass } from "@/lib/types";

interface TeachersTableProps {
  teachers: Teacher[];
  subjects: Subject[];
  classes: SchoolClass[];
  courses: Course[];
  onCreate: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => void;
  onCreateCourse: (data: any) => Promise<void>;
  onUpdateCourse: (id: number, data: any) => Promise<void>;
  onDeleteCourse: (id: number) => void;
  onRefresh: () => Promise<void>;
  isAdmin: boolean;
}

export function TeachersTable({ 
  teachers, 
  subjects, 
  classes, 
  courses,
  onCreate, 
  onUpdate, 
  onDelete,
  onCreateCourse,
  onUpdateCourse,
  onDeleteCourse,
  onRefresh,
  isAdmin 
}: TeachersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      await onUpdate(editingTeacher.id, formData);
    } else {
      await onCreate(formData);
    }
    setIsModalOpen(false);
    setEditingTeacher(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: '', // Not in current model but for future
      phone: ''
    });
    setIsModalOpen(true);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search teachers..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setEditingTeacher(null);
                setFormData({ name: '', email: '', phone: '' });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Teacher</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher, idx) => (
          <Card key={teacher.id} className="group border-none shadow-xl bg-card/50 hover:bg-card transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 50}ms` }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap size={28} />
                </div>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(teacher)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(teacher.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {teacher.name}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Academic Staff</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Course Assignments</h4>
                </div>
                
                <div className="space-y-2">
                  {courses.filter(c => c.teacher_id === teacher.id).map(course => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50 group/item hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          <BookOpen size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{course.subject.name}</p>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                            {classes.find(cls => cls.id === course.class_id)?.name} • {course.weekly_hours}h
                          </p>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onDeleteCourse(course.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {courses.filter(c => c.teacher_id === teacher.id).length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic text-center py-2">No assignments yet.</p>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">
                    {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                  </CardTitle>
                  <CardDescription>Enter the professional details for the staff member.</CardDescription>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Dr. John Smith"
                      className="w-full px-5 py-4 bg-muted/30 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-lg"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-border hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {editingTeacher ? 'Update Staff' : 'Save Member'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
