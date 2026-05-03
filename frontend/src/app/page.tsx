"use client";

import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

// Dashboard Components
import { Header } from '@/components/dashboard/Header';
import { ClassSelector } from '@/components/dashboard/ClassSelector';
import { ScheduleGrid } from '@/components/dashboard/ScheduleGrid';
import { TeachersTable } from '@/components/dashboard/TeachersTable';
import { ClassesGrid } from '@/components/dashboard/ClassesGrid';
import { CoursesTable } from '@/components/dashboard/CoursesTable';

// Types & Constants
import { Teacher, SchoolClass, Course, ScheduleEntry } from '@/lib/types';

import { Sidebar } from '@/components/dashboard/Sidebar';

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number; type: string | null }>({
    isOpen: false,
    id: 0,
    type: null
  });
  const [selectedClassId, setSelectedClassId] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('schedule');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const endpoints = ['teachers', 'classes', 'courses', 'scheduler/view'];
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_URL}/${ep}/`).then(res => {
          if (!res.ok) throw new Error(`Failed to fetch ${ep}`);
          return res.json();
        }))
      );
      
      const [teachersData, classesData, coursesData, scheduleData] = responses;

      setTeachers(teachersData || []);
      setClasses(classesData || []);
      setCourses(coursesData || []);
      setSchedule(scheduleData || []);

      if (classesData && classesData.length > 0 && selectedClassId === 'all') {
        setSelectedClassId(classesData[0].id);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to connect to backend server.");
    }
  };

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_URL}/scheduler/generate`);
      if (selectedClassId !== 'all') {
        url.searchParams.append('class_id', selectedClassId.toString());
      }
      
      const res = await fetch(url.toString(), { method: 'POST' });
      if (res.ok) {
        await fetchData();
        toast.success(selectedClassId === 'all' 
          ? "Full school schedule generated!" 
          : "Class schedule updated successfully!");
      } else {
        toast.error("Failed to generate schedule. Please check teacher constraints.");
      }
    } catch (err) {
      console.error("An error occurred!", err);
      toast.error("An error occurred while generating the schedule.");
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD Handlers ---
  const handleCreate = (type: string) => async (data: any) => {
    try {
      const res = await fetch(`${API_URL}/${type}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchData();
        toast.success(`${type.slice(0, -1)} added successfully.`);
      } else {
        toast.error(`Error adding ${type.slice(0, -1)}.`);
      }
    } catch (err) {
      toast.error("Connection error.");
    }
  };

  const handleUpdate = (type: string) => async (id: number, data: any) => {
    try {
      const res = await fetch(`${API_URL}/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchData();
        toast.success(`${type.slice(0, -1)} updated successfully.`);
      } else {
        toast.error(`Error updating ${type.slice(0, -1)}.`);
      }
    } catch (err) {
      toast.error("Connection error.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.type || !deleteConfirm.id) return;
    try {
      const res = await fetch(`${API_URL}/${deleteConfirm.type}/${deleteConfirm.id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        toast.success(`${deleteConfirm.type.slice(0, -1)} deleted successfully.`);
      } else {
        toast.error(`Error deleting item.`);
      }
    } catch (err) {
      toast.error("Connection error.");
    } finally {
      setDeleteConfirm({ isOpen: false, id: 0, type: null });
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-7xl mx-auto space-y-8">
          <Header 
            onRefresh={fetchData} 
            onGenerate={generateSchedule} 
            loading={loading} 
            activeTab={activeTab}
          />

          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-bold capitalize tracking-tight text-foreground">{activeTab} Management</h2>
            {activeTab === 'schedule' && (
              <ClassSelector 
                classes={classes} 
                selectedClassId={selectedClassId} 
                onSelect={setSelectedClassId} 
              />
            )}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'schedule' && (
              <ScheduleGrid 
                schedule={schedule} 
                teachers={teachers} 
                classes={classes} 
                selectedClassId={selectedClassId} 
              />
            )}

            {activeTab === 'teachers' && (
              <TeachersTable 
                teachers={teachers} 
                courses={courses}
                onCreate={handleCreate('teachers')}
                onUpdate={handleUpdate('teachers')}
                onDelete={(id) => setDeleteConfirm({ isOpen: true, id, type: 'teachers' })}
              />
            )}

            {activeTab === 'classes' && (
              <ClassesGrid 
                classes={classes} 
                onCreate={handleCreate('classes')}
                onUpdate={handleUpdate('classes')}
                onDelete={(id) => setDeleteConfirm({ isOpen: true, id, type: 'classes' })}
              />
            )}

            {activeTab === 'courses' && (
              <CoursesTable 
                courses={courses} 
                teachers={teachers} 
                classes={classes} 
                onCreate={handleCreate('courses')}
                onUpdate={handleUpdate('courses')}
                onDelete={(id) => setDeleteConfirm({ isOpen: true, id, type: 'courses' })}
              />
            )}
          </div>
        </div>

        <ConfirmDialog 
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, id: 0, type: null })}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          description="Are you sure you want to delete this item? This action cannot be undone and may affect the current schedule."
          confirmText="Delete Item"
          variant="danger"
        />
      </main>
    </div>
  );
}
