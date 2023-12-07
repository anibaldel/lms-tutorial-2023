"use client"

import { CategoryCourse } from "@prisma/client"
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
    items: CategoryCourse[]
}

const iconMap: Record<CategoryCourse["name"], IconType> = {
    "Musica": FcMusic,
    "Fotografia": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Contabilidad": FcSalesPerformance,
    "Ciencias de la computación": FcMultipleDevices,
    "Filmacion": FcFilmReel,
    "Ingenieria": FcEngineering,

}

export const Categories = ({items}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item)=> (
            <CategoryItem 
                key= {item.id}
                label= {item.name}
                icon= {iconMap[item.name]}
                value= {item.id}
            />
        ))}
    </div>
  )
}
