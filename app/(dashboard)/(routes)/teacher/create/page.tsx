"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "El titulo es requerido"
    }),
})

const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })
    const { isSubmitting, isValid } = form.formState;

    const onSubmit=async(values: z.infer<typeof formSchema>)=> {
        try {
            const response = await axios.post("/api/courses", values);
            console.log(response.data);
            router.push(`/teacher/courses/${response.data.id}`)
            toast.success("Curso creado")
        } catch (error) {
            toast.error("Algo salió mal")
        }
    }
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
        <div>
            <h1 className="text-2xl">
                Nombre de tu curso
            </h1>
            <p className="text-sm text-slate-600">
                Como te gustaria que se llame tu curso? No te preocupes, puedes camiarlo despues
            </p>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-8"
                >
                    <FormField 
                        control={form.control}
                        name="title"
                        render={({field})=> (
                            <FormItem>
                                <FormLabel>
                                    Titulo del curso
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isSubmitting}
                                        placeholder="ejem. 'programacion web'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Que aprenderás en este curso?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Link href="/">
                            <Button
                                type="button"
                                variant="ghost"
                            >
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            Continuar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default CreatePage