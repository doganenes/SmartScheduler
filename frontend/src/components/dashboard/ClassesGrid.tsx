import { useState } from "react";
import { GraduationCap, Edit2, Trash2, Plus, X } from 'lucide-react';
import { SchoolClass } from "@/lib/types";

interface ClassesGridProps {
  classes: SchoolClass[];
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
  onCreate: (data: any) => Promise<void>;
  isAdmin: boolean;
}

export function ClassesGrid({ classes, onUpdate, onDelete, onCreate, isAdmin }: ClassesGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      await onUpdate(editingClass.id, formData);
    } else {
      await onCreate(formData);
    }
    closeModal();
  };

  const openModal = (cls?: SchoolClass) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({ name: cls.name });
    } else {
      setEditingClass(null);
      setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setFormData({ name: '' });
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex justify-between items-center bg-muted/30 p-6 rounded-2xl border border-border">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Class
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classes.map(c => (
          <div key={c.id} className="group p-6 bg-card border border-border rounded-2xl hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all relative overflow-hidden">
            {isAdmin && (
              <div className="absolute top-0 right-0 p-2 flex gap-1 transition-opacity">
                <button
                  onClick={() => openModal(c)}
                  className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">{c.name}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto sm:items-center pt-12 sm:pt-0">
          <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-xl">{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Class Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ name: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. Grade 10-B"
                />
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
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
