import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/ColorTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackNavigatorParams } from '../navigation/HomeStackNavigator';
import { useUsuarios } from '../hooks/useUsuarios';
import { useTareas } from '../hooks/useTareas';
import { Usuario } from '../interfaces/Usuario';
import { Tarea } from '../interfaces/Tarea';
import { Sorteo } from '../interfaces/Sorteo';
import { useSorteados } from '../hooks/useSorteados';


type Selectable<T> = T & { selected: boolean }



type Props = NativeStackScreenProps<HomeStackNavigatorParams, 'SorteoScreen'>

export const SorteoScreen = ({ route, navigation }: Props) => {

    const { usuarios } = useUsuarios()
    const { tareas } = useTareas()
    const { guardarSorteados, setSorteados, sorteados, historial, guardarHistorial } = useSorteados()

    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<Selectable<Usuario>[]>([])
    const [tareasSeleccionadas, setTareasSeleccionadas] = useState<Selectable<Tarea>[]>([])



    useEffect(() => {
        if (usuarios) setUsuariosSeleccionados(usuarios.map(u => { return { ...u, selected: true } }))
        if (tareas) setTareasSeleccionadas(tareas.map(t => { return { ...t, selected: true } }))

    }, [usuarios, tareas, sorteados])

    useEffect(() => {
        if (sorteados) {
            let tmpUsuarios = usuariosSeleccionados.map(u => { return { ...u, selected: true } })

            sorteados.forEach(s => {
                let index = tmpUsuarios.findIndex(u => u.idUsuario === s.usuario.idUsuario)
                if (index > -1) {
                    tmpUsuarios[index].selected = false

                }
            })
            
            setUsuariosSeleccionados([...tmpUsuarios])
        }
    }, [sorteados])

    const RenderTarea = ({ data }: { data: Selectable<Tarea> }) => {
        return <View style={styles.renderView}>
            <Text style={styles.renderRow}>- {data.descripcion}</Text>
            <TouchableOpacity style={{
                backgroundColor: data.selected ? colors.primary : colors.background,
                borderWidth: 1,
                borderColor: colors.primary,
                width: 20,
                height: 20,
                marginLeft: 20,
                borderRadius: 5
            }} onPress={() => changeSelectedTarea(data)}>

            </TouchableOpacity>
        </View>
    }
    const RenderUsuario = ({ data }: { data: Selectable<Usuario> }) => {
        return <View style={styles.renderView}>
            <Text style={styles.renderRow}>- {data.nombre}</Text>
            <TouchableOpacity style={{
                backgroundColor: data.selected ? colors.primary : colors.background,
                borderWidth: 1,
                borderColor: colors.primary,
                width: 20,
                height: 20,
                marginLeft: 20,
                borderRadius: 5
            }} onPress={() => changeSelectedUsuario(data)}>

            </TouchableOpacity>
        </View>
    }

    const changeSelectedTarea = (tarea: Selectable<Tarea>) => {
        let tmp = tareasSeleccionadas
        let index = tareasSeleccionadas.findIndex(t => t.idTarea === tarea.idTarea)
        tmp[index].selected = !tmp[index].selected
        setTareasSeleccionadas([...tmp])
    }
    const changeSelectedUsuario = (user: Selectable<Usuario>) => {
        let tmp = usuariosSeleccionados
        let index = usuariosSeleccionados.findIndex(u => u.idUsuario === user.idUsuario)
        tmp[index].selected = !tmp[index].selected
        setUsuariosSeleccionados([...tmp])
    }

    const iniciarSorteo = () => {

        let tmp: Sorteo[] = []
        let tareas = tareasSeleccionadas.filter(t => t.selected)
        let usuarios = usuariosSeleccionados.filter(u => u.selected)
        if (tareas.length > usuarios.length) return
        tareas.forEach((tarea) => {
            var indiceAleatorio = Math.floor(Math.random() * usuarios.length);
            let user = usuarios[indiceAleatorio];
            usuarios.splice(indiceAleatorio, 1)
            tmp.push({
                tarea: tarea,
                usuario: user,
            })
        })

        setSorteados([...tmp])
        guardarSorteados(tmp)
        guardarHistorial(tmp)



    }

    const RenderSorteo = ({ data }: { data: Sorteo }) => {
        return <>
            <Text style={{ fontSize: 18, marginTop: 5 }}>Lo siento {data.usuario.nombre} te tocó {data.tarea.descripcion}</Text>
        </>
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>Tareas</Text>
            <FlatList style={{ flexGrow: 0, marginLeft: 20 }} data={tareasSeleccionadas} renderItem={({ item }) => <RenderTarea data={item} />} />
            <Text style={styles.titulo}>Usuarios</Text>
            <FlatList style={{ flexGrow: 0, marginLeft: 20 }} data={usuariosSeleccionados} renderItem={({ item }) => <RenderUsuario data={item} />} />

            <TouchableOpacity style={styles.botonSortear} onPress={iniciarSorteo}>
                <Text style={{ ...styles.titulo, color: colors.textColorPrimary }}>Sortear!</Text>
            </TouchableOpacity>

            {sorteados.length > 0 &&
                <View style={{ marginTop: 30 }}>
                    {historial.length > 0 && <Text>{historial[0].fecha}</Text>}
                    <FlatList data={sorteados} renderItem={({ item }) => <RenderSorteo data={item} />} />
                </View>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        marginHorizontal: '5%',
    },
    renderView: {
        height: 25,
        flexDirection: 'row'
    },
    titulo: {
        fontSize: 20
    },
    renderRow: {
        fontSize: 17
    },
    botonSortear: {
        backgroundColor: colors.primary,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        borderRadius: 5
    }
})

