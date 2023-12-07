"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] }
    courseId: string

}

const formSchema = z.object({
    url: z.string().min(1),
})

export const AttachmentForm = ({initialData, courseId}:AttachmentFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();
    const toogleEdit = ()=> setIsEditting((current)=> !current);


    const onSubmit = async(values: z.infer<typeof formSchema>)=> {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Curso Actualizado")
            toogleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Algo salió mal")
        }
    }

    const onDelete = async(id: string)=> {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Adjunto eliminado")
            router.refresh();
        } catch (error) {
            toast.error("Algo salió mal")
        } finally {
            setDeletingId(null);
        }
    }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Adjuntos del curso
            <Button onClick={toogleEdit} variant="ghost">
                {isEditting && (
                    <>Cancelar</>
                )} 
                {!isEditting && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Agregar una imagen
                    </>
                )}
            </Button>
        </div>
        {!isEditting && (
            <>
                {initialData.attachments.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No hay adjuntos aún
                    </p>
                )}
                {initialData.attachments.length > 0 && (
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment)=> (
                            <div
                                key={attachment.id}
                                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                            >
                                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                <p className="text-xs line-clamp-1">
                                    {attachment.name}
                                </p>
                                {deletingId === attachment.id && (
                                    <div>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                )}
                                {deletingId !== attachment.id && (
                                    <button
                                        onClick={()=> onDelete(attachment.id)}
                                        className="ml-auto hover:opacity-75 transition"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
        {isEditting && (
            <div>
                <FileUpload 
                    endPoint="courseAttachment"
                    onChange={(url)=> {
                        if(url) {
                            onSubmit({ url })
                        }
                    }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    Agregue todo lo que sus estudiantes puedan necesitar para completar el curso.
                </div>
            </div>
        )}
    </div>
  )
}
