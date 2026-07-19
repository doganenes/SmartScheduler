import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Teacher, SchoolClass, Course } from "@/lib/types";

interface StatsCardsProps {
  teachers: Teacher[];
  classes: SchoolClass[];
  courses: Course[];
}

export function StatsCards({ teachers, classes, courses }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-primary/5 border-primary/10 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
            <h3 className="text-2xl font-bold">{teachers.length}</h3>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-primary/5 border-primary/10 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
            <h3 className="text-2xl font-bold">{classes.length}</h3>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-primary/5 border-primary/10 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Weekly Hours</p>
            <h3 className="text-2xl font-bold">{courses.reduce((acc, curr) => acc + curr.weekly_hours, 0)} Hours</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
