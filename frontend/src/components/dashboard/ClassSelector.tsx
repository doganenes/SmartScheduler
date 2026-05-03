import { SchoolClass } from "@/lib/types";

interface ClassSelectorProps {
  classes: SchoolClass[];
  selectedClassId: number | 'all';
  onSelect: (id: number | 'all') => void;
}

export function ClassSelector({ classes, selectedClassId, onSelect }: ClassSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-card/50 backdrop-blur-sm p-2 rounded-2xl border border-border shadow-inner">
      <div className="flex items-center gap-2 px-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Class View</span>
      </div>
      <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-xl w-full">
        {classes.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              selectedClassId === c.id 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
