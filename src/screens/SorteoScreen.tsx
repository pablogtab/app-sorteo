import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/ColorTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackNavigatorParams } from '../navigation/HomeStackNavigator';
import { useUsuarios } from '../hooks/useUsuarios';
import { useTareas } from '../hooks/useTareas';
import { Usuario } from '../interfaces/Usuario';
import { Tarea } from '../interfaces/Tarea';


type Selectable<T> = T & { selected: boolean }

type Sorteo = {
    tarea: Tarea
    usuario: Usuario
}

type Props = NativeStackScreenProps<HomeStackNavigatorParams, 'SorteoScreen'>

export const SorteoScreen = ({ route, navigation }: Props) => {

    const { usuarios } = useUsuarios()
    const { tareas } = useTareas()

    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<Selectable<Usuario>[]>([])
    const [tareasSeleccionadas, setTareasSeleccionadas] = useState<Selectable<Tarea>[]>([])



    useEffect(() => {
        if (usuarios) setUsuariosSeleccionados(usuarios.map(u => { return { ...u, selected: true } }))
        if (tareas) setTareasSeleccionadas(tareas.map(t => { return { ...t, selected: true } }))
    }, [usuarios, tareas])

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
        tareas.forEach((tarea) => {
            var indiceAleatorio = Math.floor(Math.random() * usuarios.length);
            let user = usuarios[indiceAleatorio];
            usuarios.splice(indiceAleatorio, 1)
            tmp.push({
                tarea: tarea,
                usuario: user
            })
        })
        console.log(tmp.map((data) => { return data.usuario.nombre + ' ' + data.tarea.descripcion }))
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

