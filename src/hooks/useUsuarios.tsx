import { useEffect, useState } from "react"
import { Usuario } from "../interfaces/Usuario"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUsuarios = () => {

    const [usuarios, setUsuarios] = useState<Usuario[]>([])

    useEffect(() => {
        cargarUsuarios()
    }, [])

    const cargarUsuarios = async () => {
        let tmp = await AsyncStorage.getItem('@Usuarios')
        if (tmp) {
            setUsuarios(JSON.parse(tmp))
        }
    }

    const nuevoUsuario = async (usuario: Usuario) => {
        const tmp = [...usuarios, usuario]
        setUsuarios(tmp)
        await AsyncStorage.setItem('@Usuarios', JSON.stringify(tmp))
    }

    const eliminarUsuario = async (usuario: Usuario) => {
        let userIndex = usuarios.findIndex(u => u === usuario)
        let tmp = usuarios
        tmp.splice(userIndex, 1)
        setUsuarios([...tmp])
        await AsyncStorage.setItem('@Usuarios', JSON.stringify(tmp))
    }


    return {
        usuarios,
        nuevoUsuario,
        eliminarUsuario,
    }
}