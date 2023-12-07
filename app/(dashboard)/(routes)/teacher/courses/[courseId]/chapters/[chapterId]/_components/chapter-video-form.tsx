"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
    initialData: Chapter & {muxData? : MuxData | null}
    courseId: string;
    chapterId: string

}

const formSchema = z.object({
    videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({initialData, courseId, chapterId}:ChapterVideoFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const router = useRouter();
    const toogleEdit = ()=> setIsEditting((current)=> !current);


    const onSubmit = async(values: z.infer<typeof formSchema>)=> {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Capítulo Actualizado")
            toogleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Algo salió mal")
        }
    }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            video del capitulo
            <Button onClick={toogleEdit} variant="ghost">
                {isEditting && (
                    <>Cancelar</>
                )} 
                {!isEditting && !initialData.videoUrl && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Agregar un video
                    </>
                )}
                {!isEditting && initialData.videoUrl &&
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Editar video
                    </>
                }
            </Button>
        </div>
        {!isEditting && (
            !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <Video className="h-10 w-10 text-slate-500" />
                </div>
            ) : (
                <div className="relative aspect-video mt-2">
                    <MuxPlayer 
                        playbackId={initialData?.muxData?.playbackId || ""}
                    />
                </div>
            )
        )}
        {isEditting && (
            <div>
                <FileUpload 
                    endPoint="chapterVideo"
                    onChange={(url)=> {
                        if(url) {
                            onSubmit({ videoUrl: url })
                        }
                    }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    sube el video de este capítulo
                </div>
            </div>
        )}
        {initialData.videoUrl && !isEditting && (
            <div className="text-xs text-muted-foreground mt-2">
                Los vídeos pueden tardar unos minutos en procesarse. Actualiza la página si el video no aparece.
            </div>
        )}
    </div>
  )
}
