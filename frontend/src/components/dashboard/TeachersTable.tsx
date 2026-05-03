import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Teacher, DAYS, SLOTS, Course, Subject, SchoolClass } from "@/lib/types";
import { Edit2, Trash2, Plus, X, GraduationCap, Clock } from "lucide-react";

interface TeachersTableProps {
  teachers: Teacher[];
  subjects: Subject[];
  classes: SchoolClass[];
  courses: Course[];
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
  onCreate: (data: any) => Promise<void>;
  onCreateCourse: (data: any) => Promise<void>;
  onUpdateCourse: (id: number, data: any) => Promise<void>;
  onDeleteCourse: (id: number) => void | Promise<void>;
  isAdmin: boolean;
}

export function TeachersTable({
  teachers, subjects, classes, courses,
  onUpdate, onDelete, onCreate,
  onCreateCourse, onUpdateCourse, onDeleteCourse,
  isAdmin
}: TeachersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    availability: [] as { day: number, slot: number }[]
  });

  const [assignmentForm, setAssignmentForm] = useState({
    subject_id: subjects[0]?.id || 0,
    class_id: classes[0]?.id || 0,
    weekly_hours: 2
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      availability: formData.availability
    };

    if (editingTeacher) {
      await onUpdate(editingTeacher.id, data);
    } else {
      await onCreate(data);
    }
    closeModal();
  };


  const toggleSlot = (day: number, slot: number) => {
    const exists = formData.availability.find(s => s.day === day && s.slot === slot);
    if (exists) {
      setFormData({
        ...formData,
        availability: formData.availability.filter(s => !(s.day === day && s.slot === slot))
      });
    } else {
      setFormData({
        ...formData,
        availability: [...formData.availability, { day, slot }]
      });
    }
  };

  const openModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        availability: teacher.availability || []
      });
    } else {
      setEditingTeacher(null);
      setFormData({ name: '', availability: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setFormData({ name: '', availability: [] });
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Teacher List</CardTitle>
          <CardDescription>Teachers registered in the system and their assignments.</CardDescription>
        </div>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Full Name</TableHead>
                <TableHead>Lectures</TableHead>
                <TableHead>Busy Times</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => {
                const teacherCourses = courses.filter(c => c.teacher_id === teacher.id);
                return (
                  <TableRow key={teacher.id} className="hover:bg-muted/50 group">
                    <TableCell className="font-bold text-foreground">{teacher.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(new Set(teacherCourses.map(c => c.subject.name))).map(subjectName => {
                          const subjectClasses = teacherCourses
                            .filter(c => c.subject.name === subjectName)
                            .map(c => classes.find(cl => cl.id === c.class_id)?.name)
                            .filter(Boolean)
                            .join(', ');
                          return (
                            <span key={subjectName} className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              {subjectName} <span className="opacity-60 ml-1">({subjectClasses})</span>
                            </span>
                          );
                        })}
                        {teacherCourses.length === 0 && <span className="text-muted-foreground text-xs italic">No assignments</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5 max-w-[400px]">
                        {teacher.availability && teacher.availability.length > 0 ? (
                          teacher.availability.map((slot, idx) => (
                            <span key={idx} className="bg-destructive/10 text-destructive border border-destructive/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                              {DAYS[slot.day].substring(0, 3)} {SLOTS[slot.slot]}
                            </span>
                          ))
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Always Available
                          </span>
                        )}
                      </div>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <button
                            onClick={() => openModal(teacher)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(teacher.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-xl">{editingTeacher ? `Edit Teacher: ${editingTeacher.name}` : 'Add New Teacher'}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: General Info & Availability */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                      <input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="e.g. John Smith"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Select Busy Slots (Constraints)</label>
                      <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                        <div className="grid grid-cols-6 gap-1">
                          <div className="h-8"></div>
                          {DAYS.map(day => <div key={day} className="text-[10px] font-bold text-center text-muted-foreground uppercase">{day.substring(0, 3)}</div>)}

                          {SLOTS.map((time, sIdx) => (
                            <React.Fragment key={time}>
                              <div className="text-[10px] font-bold flex items-center pr-2 text-muted-foreground">{time}</div>
                              {DAYS.map((_, dIdx) => {
                                const isBusy = formData.availability.some(s => s.day === dIdx && s.slot === sIdx);
                                return (
                                  <div
                                    key={`${dIdx}-${sIdx}`}
                                    onClick={() => toggleSlot(dIdx, sIdx)}
                                    className={`h-8 rounded-md cursor-pointer transition-all border ${isBusy
                                      ? 'bg-destructive text-white border-destructive'
                                      : 'bg-background hover:bg-primary/10 border-border'
                                      } flex items-center justify-center text-[8px] font-bold`}
                                  >
                                    {isBusy ? 'BUSY' : ''}
                                  </div>
                                );
                              })}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                      {editingTeacher ? 'Update Teacher Info' : 'Create Teacher'}
                    </button>
                  </form>
                </div>

                {/* Right Side: Assignments (Only if editing) */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Course Assignments (Distributions)</h4>

                  {!editingTeacher ? (
                    <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground">
                      Save teacher first to manage assignments.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Add Assignment Form */}
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Subject</label>
                            <select
                              value={assignmentForm.subject_id}
                              onChange={e => setAssignmentForm({ ...assignmentForm, subject_id: parseInt(e.target.value) })}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                            >
                              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Weekly Hours (Per Class)</label>
                            <input
                              type="number"
                              min="1" max="10"
                              value={assignmentForm.weekly_hours}
                              onChange={e => setAssignmentForm({ ...assignmentForm, weekly_hours: parseInt(e.target.value) })}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!editingTeacher) return;
                            // Create for ALL classes
                            for (const cls of classes) {
                              await onCreateCourse({
                                subject_id: assignmentForm.subject_id,
                                teacher_id: editingTeacher.id,
                                class_id: cls.id,
                                weekly_hours: assignmentForm.weekly_hours
                              });
                            }
                            setAssignmentForm({
                              subject_id: subjects[0]?.id || 0,
                              class_id: classes[0]?.id || 0,
                              weekly_hours: 2
                            });
                          }}
                          className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all"
                        >
                          <Plus className="w-4 h-4" /> Add Subject to All Classes
                        </button>
                      </div>

                      {/* Assignments List */}
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {courses.filter(c => c.teacher_id === editingTeacher.id).map(course => (
                          <div key={course.id} className="flex items-center justify-between bg-muted/50 border border-border p-3 rounded-xl group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">{course.subject.name}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                  {classes.find(c => c.id === course.class_id)?.name} • {course.weekly_hours} Hours
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => onDeleteCourse(course.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {courses.filter(c => c.teacher_id === editingTeacher.id).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm italic">
                            No assignments yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
