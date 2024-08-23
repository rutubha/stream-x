import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  buttonIcon?: string;
  buttonText?: string;
  children?: React.ReactNode;
  className?: string;
  image?: string;
  handleClick?: () => void;
}

const MeetingModal: React.FC<MeetingModalProps> = (props) => {
  const {
    buttonIcon,
    buttonText = "Schedule Meeting",
    children,
    className,
    handleClick,
    image,
    isOpen,
    onClose,
    title,
  } = props;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="" width={72} height={72} />
            </div>
          )}
          <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
            {title}
          </h1>
          {children}
          <Button
            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image src={buttonIcon} alt="" width={13} height={13} />
            )}
            &nbsp;
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
