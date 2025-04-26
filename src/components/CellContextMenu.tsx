
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Scissors, ClipboardPaste, Trash, MoveIcon } from "lucide-react";

interface CellContextMenuProps {
  children: React.ReactNode;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onMove: () => void;
}

const CellContextMenu: React.FC<CellContextMenuProps> = ({
  children,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onMove
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCut}>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Cut</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onPaste}>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          <span>Paste</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onMove}>
          <MoveIcon className="mr-2 h-4 w-4" />
          <span>Move</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CellContextMenu;
