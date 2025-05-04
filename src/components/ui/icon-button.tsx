
import React from 'react';
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg" | "icon";
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  active = false,
  variant = "ghost",
  size = "sm",
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col items-center">
      <Button 
        variant={variant} 
        size={size}
        className={cn(
          active && "bg-gray-300",
          className
        )}
        {...props}
      >
        {icon}
      </Button>
      {label && <span className="text-[10px] mt-1">{label}</span>}
    </div>
  );
};

export default IconButton;
