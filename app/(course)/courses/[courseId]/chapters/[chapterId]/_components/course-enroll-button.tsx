"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string
}

export const CourseEnrollButton = ({price, courseId}:CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onClick=async()=> {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`)
      toast.success("Curso comprado!")
    } catch (error) {
      toast.error("Algo salio mal")
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        className="w-full md:w-auto"
    >
        Inscribite por {formatPrice(price)}
    </Button>
  )
}
