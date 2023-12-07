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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";

interface DescriptionFormProps {
    initialData: Course
    courseId: string

}

const formSchema = z.object({
    description: z.string().min(1, {
        message: "La descripcion es requerida"
    }),
})

export const DescriptionForm = ({initialData, courseId}:DescriptionFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const router = useRouter();
    const toogleEdit = ()=> setIsEditting((current)=> !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

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
            Descripción del curso
            <Button onClick={toogleEdit} variant="ghost">
                {isEditting ? (
                    <>Cancelar</>
                ) : (
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Editar Descripción
                    </>
                )}
            </Button>
        </div>
        {!isEditting && (
            <p className={cn(
                "text-sm mt-2",
                !initialData.description && "text-slate-500 italic"
            )}>
                {initialData.description || "No hay descripción"}
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
                        name="description"
                        render={({field})=> (
                            <FormItem>
                                <FormControl>
                                    <Textarea 
                                        disabled={isSubmitting}
                                        placeholder="ejm. 'Este curso es sobre...'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
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
