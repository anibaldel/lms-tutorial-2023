"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}
export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps
) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();
    const onClick=async()=> {
        try {
            setIsLoading(true);
            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Curso no publicado");
                
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Curso publicado");
                confetti.onOpen();
            }

            router.refresh();
            
        } catch (error) {
            toast.error("Algo salió mal")
        } finally {
            setIsLoading(false)
        }
    }
    const onDelete =async()=> {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Curso eliminado");
            router.refresh();
            router.push(`/teacher/courses/`)
        } catch (error) {
            toast.error("Algo salió mal")
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <div className="flex items-center gap-x-2">
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant="outline"
            size="sm"
        >
            {isPublished ? "No publicar": "publicar"}
        </Button>
        <ConfirmModal onConfirm={onDelete}>
            <Button size="sm">
                <Trash className="h-4 w-4"/>
            </Button>
        </ConfirmModal>
    </div>
  )
}
