"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    isCompleted?: boolean;

}

export const CourseProgressButton = ({
    chapterId,
    courseId,
    nextChapterId,
    isCompleted,

}:CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const Icon = isCompleted ? XCircle: CheckCircle;

  const onClick=async()=> {
    try {
      setIsLoading(true);
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      })

      if(!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if(!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    
      }

      toast.success("Progreso actualizado");
      router.refresh()
    } catch (error) {
      toast.error("Algo salio mal")
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button
      type="button"
      disabled={isLoading}
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
      onClick={onClick}
    >
      {isCompleted ? "No completado" : "Marcar como Completo"}
      <Icon className="h-4 w-4 ml-2"/>
    </Button>
  )
}
