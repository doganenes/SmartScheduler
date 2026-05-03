import { GraduationCap, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Teacher, SchoolClass, ScheduleEntry, DAYS, SLOTS } from "@/lib/types";

interface ScheduleGridProps {
  schedule: ScheduleEntry[];
  teachers: Teacher[];
  classes: SchoolClass[];
  selectedClassId: number | 'all';
}

export function ScheduleGrid({ schedule, teachers, classes, selectedClassId }: ScheduleGridProps) {
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
        <div>
          <CardTitle className="text-2xl">Weekly Timetable</CardTitle>
          <CardDescription>
            {selectedClassId !== 'all' 
              ? `Course distribution for class ${classes.find(c => c.id === selectedClassId)?.name}.` 
              : "Program for all classes (for conflict checking)."}
          </CardDescription>
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
                            <div>
                              <p className="font-bold text-sm text-foreground group-hover/card:text-primary transition-colors leading-tight">{entry.course.name}</p>
                              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5 font-medium">
                                <GraduationCap className="w-3.5 h-3.5 text-primary/70" />
                                {classes.find(c => c.id === entry.course.class_id)?.name}
                              </p>
                            </div>
                            <p className="text-[10px] font-bold text-accent-foreground uppercase tracking-wider mt-2 flex items-center gap-1.5 bg-accent/20 w-fit px-2 py-0.5 rounded">
                              <Users className="w-3.5 h-3.5" />
                              {teachers.find(t => t.id === entry.course.teacher_id)?.name}
                            </p>
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
