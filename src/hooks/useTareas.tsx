import { useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tarea } from "../interfaces/Tarea";

export const useTareas = () => {

    const [tareas, setTareas] = useState<Tarea[]>([])

    useEffect(() => {
        cargarTareas()
    }, [])

    const cargarTareas = async () => {
        let tmp = await AsyncStorage.getItem('@Tareas')
        if (tmp) {
            setTareas(JSON.parse(tmp))
        }
    }

    const nuevaTarea = async (tarea: Tarea) => {
        const tmp = [...tareas, tarea]
        setTareas(tmp)
        await AsyncStorage.setItem('@Tareas', JSON.stringify(tmp))
    }

    const eliminarTarea = async (tarea: Tarea) => {
        let userIndex = tareas.findIndex(t => t === tarea)
        let tmp = tareas
        tmp.splice(userIndex, 1)
        setTareas([...tmp])
        await AsyncStorage.setItem('@Tareas', JSON.stringify(tmp))
    }


    return {
        tareas,
        nuevaTarea,
        eliminarTarea,
    }
}