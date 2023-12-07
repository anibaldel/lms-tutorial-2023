import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params} :{ params: {courseId: string }}
) {
    try {
        const user = await currentUser();

        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("No autorizado", {status: 401})
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        });

        if(purchase) {
            return new NextResponse("Ya comprado", {status: 400})
        }
        if(!course) {
            return new NextResponse("No encontrado", {status: 404})
        }

        const purchaseOk = await db.purchase.create({
            data: {
                courseId: params.courseId,
                userId: user.id,
            }
        })

        return NextResponse.json(purchaseOk,{status:200})
        
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Error interno", {status: 500})
    }
}