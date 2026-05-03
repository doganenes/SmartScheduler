import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Teacher, DAYS, SLOTS, Course } from "@/lib/types";
import { Edit2, Trash2, Plus, X } from "lucide-react";

interface TeachersTableProps {
  teachers: Teacher[];
  courses: Course[];
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
  onCreate: (data: any) => Promise<void>;
}

export function TeachersTable({ teachers, courses, onUpdate, onDelete, onCreate }: TeachersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({ name: '', subjects: [] as string[], availability: [] as { day: number, slot: number }[] });

  // Get unique subjects from courses
  const availableSubjects = Array.from(new Set(courses.map(c => c.name))).sort();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      subjects: formData.subjects,
      availability: formData.availability
    };

    if (editingTeacher) {
      await onUpdate(editingTeacher.id, data);
    } else {
      await onCreate(data);
    }
    closeModal();
  };

  const toggleSubject = (subject: string) => {
    if (formData.subjects.includes(subject)) {
      setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subject) });
    } else {
      setFormData({ ...formData, subjects: [...formData.subjects, subject] });
    }
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
        subjects: teacher.subjects,
        availability: teacher.availability || []
      });
    } else {
      setEditingTeacher(null);
      setFormData({ name: '', subjects: [], availability: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setFormData({ name: '', subjects: [], availability: [] });
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Teacher List</CardTitle>
          <CardDescription>Teachers registered in the system and their subjects.</CardDescription>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Full Name</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Busy Times</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id} className="hover:bg-muted/50 group">
                <TableCell className="font-bold text-foreground">{teacher.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects.map(subject => (
                      <span key={subject} className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{subject}</span>
                    ))}
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
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-xl">{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
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
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Teaching Subjects</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 border border-border rounded-xl min-h-[100px]">
                        {availableSubjects.length > 0 ? (
                          availableSubjects.map(subject => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => toggleSubject(subject)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.subjects.includes(subject)
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                                }`}
                            >
                              {subject}
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No courses found in system. Add courses first.</p>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">Select from available courses in the database.</p>
                    </div>
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
                </div>

                <div className="pt-4 flex gap-3 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-4 rounded-xl font-bold border border-border hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    {editingTeacher ? 'Save Changes' : 'Create Teacher'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
