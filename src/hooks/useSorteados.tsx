import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Sorteo } from '../interfaces/Sorteo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Historial } from '../interfaces/Historial';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';


export const useSorteados = () => {

    const [historial, setHistorial] = useState<Historial[]>([])
    const [sorteados, setSorteados] = useState<Sorteo[]>([])
    const focused = useIsFocused()

    useEffect(() => {
        cargarSorteados()
        cargarHistorial()
    }, [focused])


    const cargarSorteados = async () => {
        let tmp = await AsyncStorage.getItem('@Sorteados')
        if (tmp) {
            setSorteados(JSON.parse(tmp))
        }
    }

    const cargarHistorial = async () => {
        let tmp = await AsyncStorage.getItem('@Historial')
        if (tmp) {
            setHistorial(JSON.parse(tmp))
        }
    }

    const guardarSorteados = async (sorteados: Sorteo[]) => {
        await AsyncStorage.setItem('@Sorteados', JSON.stringify(sorteados))
    }

    const guardarHistorial = async (sorteados: Sorteo[]) => {
        let tmp: Historial = {
            fecha: new Date().toLocaleString(),
            sorteados: sorteados
        }
        setHistorial([tmp, ...historial])

        await AsyncStorage.setItem('@Historial', JSON.stringify([tmp, ...historial]))
    }

    const limpiarHistorial = () => {
        setHistorial([])
        AsyncStorage.setItem('@Sorteados', JSON.stringify([]))
        AsyncStorage.setItem('@Historial', JSON.stringify([]))
    }

    return { sorteados, setSorteados, guardarSorteados, guardarHistorial, historial, limpiarHistorial }
}
