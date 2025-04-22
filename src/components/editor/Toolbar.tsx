import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MousePointerIcon, 
  HandIcon, 
  ZoomInIcon, 
  UndoIcon, 
  RedoIcon,
  LayoutGridIcon,
  RulerIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

interface ToolButtonProps {
  icon: typeof MousePointerIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function ToolButton({ icon: Icon, label, active, onClick }: ToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8',
            active && 'bg-accent text-accent-foreground'
          )}
          onClick={onClick}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  return (
    <div className="tools-bar">
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <ToolButton
          icon={MousePointerIcon}
          label="Select (V)"
          active={activeTool === 'select'}
          onClick={() => onToolChange('select')}
        />
        <ToolButton
          icon={HandIcon}
          label="Pan (H)"
          active={activeTool === 'pan'}
          onClick={() => onToolChange('pan')}
        />
        <ToolButton
          icon={ZoomInIcon}
          label="Zoom (Z)"
          active={activeTool === 'zoom'}
          onClick={() => onToolChange('zoom')}
        />
      </div>
      
      <div className="flex items-center gap-1 border-r border-border px-2">
        <ToolButton
          icon={UndoIcon}
          label="Undo (⌘Z)"
          onClick={() => {}}
        />
        <ToolButton
          icon={RedoIcon}
          label="Redo (⌘⇧Z)"
          onClick={() => {}}
        />
      </div>
      
      <div className="flex items-center gap-1 px-2">
        <ToolButton
          icon={LayoutGridIcon}
          label="Toggle Grid"
          active={activeTool === 'grid'}
          onClick={() => onToolChange('grid')}
        />
        <ToolButton
          icon={RulerIcon}
          label="Toggle Rulers"
          active={activeTool === 'rulers'}
          onClick={() => onToolChange('rulers')}
        />
      </div>
    </div>
  );
}