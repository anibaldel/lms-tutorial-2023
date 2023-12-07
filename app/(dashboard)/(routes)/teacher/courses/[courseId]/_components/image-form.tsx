"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
    initialData: Course
    courseId: string

}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "La imagen es requerida"
    }),
})

export const ImageForm = ({initialData, courseId}:ImageFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const router = useRouter();
    const toogleEdit = ()=> setIsEditting((current)=> !current);


    const onSubmit = async(values: z.infer<typeof formSchema>)=> {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Curso Actualizado")
            toogleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Algo salió mal")
        }
    }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Imagen del curso
            <Button onClick={toogleEdit} variant="ghost">
                {isEditting && (
                    <>Cancelar</>
                )} 
                {!isEditting && !initialData.imageUrl && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Agregar una imagen
                    </>
                )}
                {!isEditting && initialData.imageUrl &&
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Editar Imagen
                    </>
                }
            </Button>
        </div>
        {!isEditting && (
            !initialData.imageUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <ImageIcon className="h-10 w-10 text-slate-500" />
                </div>
            ) : (
                <div className="relative aspect-video mt-2">
                    <Image 
                        alt="Subir"
                        fill
                        className="object-cover rounded-md"
                        src={initialData.imageUrl}
                    />
                </div>
            )
        )}
        {isEditting && (
            <div>
                <FileUpload 
                    endPoint="courseImage"
                    onChange={(url)=> {
                        if(url) {
                            onSubmit({ imageUrl: url })
                        }
                    }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    16 : 9 relación de aspecto recomendada
                </div>
            </div>
        )}
    </div>
  )
}
