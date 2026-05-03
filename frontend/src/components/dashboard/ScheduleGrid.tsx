import { GraduationCap, Users, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Teacher, SchoolClass, ScheduleEntry, DAYS, SLOTS } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ScheduleGridProps {
  schedule: ScheduleEntry[];
  teachers: Teacher[];
  classes: SchoolClass[];
  selectedClassId: number | 'all';
  onGenerate: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

export function ScheduleGrid({ schedule, teachers, classes, selectedClassId, onGenerate, loading, isAdmin }: ScheduleGridProps) {
  const getEntryAt = (day: number, slot: number) => {
    return schedule.find(s => 
      s.day === day && 
      s.slot === slot && 
      (selectedClassId === 'all' || s.course.class_id === selectedClassId)
    );
  };

  return (
    <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl">Weekly Timetable</CardTitle>
              {isAdmin && (
                <Button 
                  size="sm" 
                  onClick={onGenerate} 
                  disabled={loading} 
                  className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 rounded-xl hidden sm:flex h-9"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? "Generating..." : "Generate"}
                </Button>
              )}
            </div>
            <CardDescription className="mt-1">
              {selectedClassId !== 'all' 
                ? `Course distribution for class ${classes.find(c => c.id === selectedClassId)?.name}.` 
                : "Program for all classes (for conflict checking)."}
            </CardDescription>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={onGenerate} 
              disabled={loading} 
              className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 rounded-xl flex sm:hidden w-full"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Generating..." : "Generate Schedule"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-border bg-background/50">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/80">
                <th className="p-4 text-left font-bold border-b border-r border-border w-[120px] text-primary">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="p-4 text-center font-bold border-b border-border text-foreground">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((time, slotIdx) => (
                <tr key={time} className="hover:bg-primary/5 transition-colors group">
                  <td className="p-4 font-bold border-r border-border bg-muted/30 text-muted-foreground group-hover:text-primary transition-colors">{time}</td>
                  {DAYS.map((_, dayIdx) => {
                    const entry = getEntryAt(dayIdx, slotIdx);
                    return (
                      <td key={`${dayIdx}-${slotIdx}`} className="p-2 border-b border-l border-border h-28 min-w-[160px]">
                        {entry ? (
                          <div className="h-full w-full bg-primary/10 border-l-4 border-primary rounded-lg p-3 flex flex-col justify-between group/card hover:bg-primary/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                            <div className="space-y-1">
                              <p className="font-black text-sm text-primary leading-tight uppercase tracking-tight">
                                {entry.course.subject.name}
                              </p>
                              {selectedClassId === 'all' && (
                                <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 opacity-70">
                                  <GraduationCap className="w-3 h-3" />
                                  {classes.find(c => c.id === entry.course.class_id)?.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-auto bg-primary/5 rounded-md px-2 py-1 w-fit group-hover/card:bg-primary/10 transition-colors">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              <p className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">
                                {teachers.find(t => t.id === entry.course.teacher_id)?.name}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground/20 italic text-xs border-2 border-dashed border-muted rounded-lg group-hover:border-primary/20 transition-colors">
                            {/* Empty slot */}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
