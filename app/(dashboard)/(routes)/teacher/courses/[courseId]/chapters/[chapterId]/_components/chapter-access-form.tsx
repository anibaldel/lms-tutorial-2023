"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string

}

const formSchema = z.object({
    isFree: z.boolean().default(false)
})

export const ChapterAccessForm = ({initialData, courseId, chapterId}:ChapterAccessFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const router = useRouter();
    const toogleEdit = ()=> setIsEditting((current)=> !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree //doble !! = Boolean
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>)=> {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Capitulo Actualizado")
            toogleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Algo salió mal")
        }
    }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Acceso al capitulo
            <Button onClick={toogleEdit} variant="ghost">
                {isEditting ? (
                    <>Cancelar</>
                ) : (
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Editar accseso
                    </>
                )}
            </Button>
        </div>
        {!isEditting && (
            <p className={cn(
                "text-sm mt-2",
                !initialData.isFree && "text-slate-500 italic"
            )}>
                {initialData.isFree ?(
                    <>Este capítulo es gratis para vista previa.</>
                ): (
                    <>Este capitulo no es gratis</>
                )}
            </p>
        )}
        {isEditting && (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField 
                        control={form.control}
                        name="isFree"
                        render={({field})=> (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormDescription>
                                        Marque esta casilla si desea que este capítulo sea gratuito para obtener una vista previa.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid ||isSubmitting}
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </Form>
        )}
    </div>
  )
}
