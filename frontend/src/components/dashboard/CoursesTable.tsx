import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course, Teacher, SchoolClass } from "@/lib/types";
import { Edit2, Trash2, Plus, X, BookOpen } from "lucide-react";

interface CoursesTableProps {
  courses: Course[];
  teachers: Teacher[];
  classes: SchoolClass[];
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
  onCreate: (data: any) => Promise<void>;
}

export function CoursesTable({ courses, teachers, classes, onUpdate, onDelete, onCreate }: CoursesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    weekly_hours: 2,
    class_id: classes[0]?.id || 0,
    teacher_id: teachers[0]?.id || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      await onUpdate(editingCourse.id, formData);
    } else {
      await onCreate(formData);
    }
    closeModal();
  };

  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        weekly_hours: course.weekly_hours,
        class_id: course.class_id,
        teacher_id: course.teacher_id
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        weekly_hours: 2,
        class_id: classes[0]?.id || 0,
        teacher_id: teachers[0]?.id || 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Distributions</CardTitle>
          <CardDescription>Manage curriculum and teacher assignments.</CardDescription>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Weekly Hours</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(courses.reduce((acc, course) => {
              const key = `${course.name}-${course.teacher_id}-${course.weekly_hours}`;
              if (!acc[key]) {
                acc[key] = { ...course, classNames: [] as string[], ids: [] as number[] };
              }
              const className = classes.find(c => c.id === course.class_id)?.name || 'Unknown';
              acc[key].classNames.push(className);
              acc[key].ids.push(course.id);
              return acc;
            }, {} as Record<string, any>)).map((group: any) => (
              <TableRow key={group.ids[0]} className="hover:bg-muted/50 group">
                <TableCell className="font-bold text-foreground">{group.name}</TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="flex flex-wrap gap-2 py-1">
                    {group.classNames.map((name: string) => (
                      <span key={name} className="bg-primary/5 text-primary border border-primary/20 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-medium">{teachers.find(t => t.id === group.teacher_id)?.name}</TableCell>
                <TableCell className="font-bold text-primary">{group.weekly_hours} Hours</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(group)}
                      className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(group.ids[0])}
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
          <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-xl">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Course Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. Mathematics"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Weekly Hours</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.weekly_hours}
                    onChange={e => setFormData({ ...formData, weekly_hours: parseInt(e.target.value) })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Class</label>
                  <select
                    value={formData.class_id}
                    onChange={e => setFormData({ ...formData, class_id: parseInt(e.target.value) })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Teacher</label>
                <select
                  value={formData.teacher_id}
                  onChange={e => setFormData({ ...formData, teacher_id: parseInt(e.target.value) })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {teachers.map(t => {
                    // Calculate teacher capacity
                    const busySlotsCount = t.availability?.length || 0;
                    const maxCapacity = 40 - busySlotsCount;
                    const currentWorkload = courses
                      .filter(c => c.teacher_id === t.id && (editingCourse ? !(editingCourse.ids?.includes(c.id) || editingCourse.id === c.id) : true))
                      .reduce((sum, c) => sum + c.weekly_hours, 0);

                    const remainingCapacity = maxCapacity - currentWorkload;
                    const isBusy = remainingCapacity < formData.weekly_hours;

                    return (
                      <option key={t.id} value={t.id} disabled={isBusy}>
                        {t.name} ({t.subjects.join(', ')})
                        {isBusy ? ` ⚠️ BUSY (Rem: ${remainingCapacity}h)` : ` (${remainingCapacity}h free)`}
                      </option>
                    );
                  })}
                </select>
                <p className="text-[10px] text-muted-foreground italic">
                  Teachers are disabled if their remaining capacity is less than the required weekly hours.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold border border-border hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
