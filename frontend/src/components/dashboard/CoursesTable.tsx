import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Subject } from "@/lib/types";
import { Edit2, Trash2, Plus, X, Book, Search } from "lucide-react";

interface CoursesTableProps {
  subjects: Subject[];
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
  onCreate: (data: any) => Promise<void>;
  isAdmin: boolean;
}

export function CoursesTable({ subjects, onUpdate, onDelete, onCreate, isAdmin }: CoursesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: ''
  });

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      await onUpdate(editingSubject.id, formData);
    } else {
      await onCreate(formData);
    }
    closeModal();
  };

  const openModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Subject
          </button>
        )}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="group relative bg-card hover:bg-accent/5 border border-border rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
                <Book className="w-6 h-6" />
              </div>

              {isAdmin && (
                <div className="flex gap-1 transition-opacity">
                  <button
                    onClick={() => openModal(subject)}
                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(subject.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {subject.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider opacity-70">
                General Subject
              </p>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-b-2xl" />
          </div>
        ))}

        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No subjects found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-2xl">{editingSubject ? 'Edit Subject' : 'New Subject'}</h3>
              </div>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Subject Name</label>
                <input
                  required
                  autoFocus
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-muted/50 border-2 border-border rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                  placeholder="e.g. Quantum Physics"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold border-2 border-border hover:bg-muted transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                >
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
