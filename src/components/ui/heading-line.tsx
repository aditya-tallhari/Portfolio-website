import { cn } from "@/lib/utils";

export const HeadingLine = ({ className, lineWidth = 40 }: { className?: string, lineWidth?: number }) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div 
        className="h-[2px] bg-gradient-to-r from-indigo-500 to-transparent rounded-full" 
        style={{ width: `${lineWidth}%` }} 
      />
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
    </div>
  );
};
