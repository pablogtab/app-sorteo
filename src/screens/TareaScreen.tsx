import React, { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/ColorTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackNavigatorParams } from '../navigation/HomeStackNavigator';
import { useTareas } from '../hooks/useTareas';
import { Tarea } from '../interfaces/Tarea';
import * as Crypto from 'expo-crypto';

type Props = NativeStackScreenProps<HomeStackNavigatorParams, 'TareaScreen'>

export const TareaScreen = ({ navigation, route }: Props) => {


    const { tareas, eliminarTarea, nuevaTarea } = useTareas()
    const [editando, setEditando] = useState<boolean>(false)
    const [descrip, setDescrip] = useState<string>('')

    const nuevoBoton = () => {
        setEditando(true)
        setDescrip('')
    }

    const cancelar = () => {
        setEditando(false)
        setDescrip('')
    }

    const guardarTarea = () => {
        if (descrip) {
            setEditando(false)

            nuevaTarea({ idTarea: Crypto.randomUUID(), descripcion: descrip })
        }
    }

    const RenderTarea = ({ data }: { data: Tarea }) => {
        return <View style={styles.renderTarea}>
            <Text style={{ fontSize: 19 }}>{data.descripcion}</Text>
            <TouchableOpacity onPress={() => eliminarTarea(data)}>
                <Text>Eliminar</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: '5%', justifyContent: 'space-between' }}>
                <Text style={styles.textTarea}>Tareas</Text>
                <View style={{ flexDirection: 'row' }}>
                    {
                        editando &&
                        <TouchableOpacity style={{ ...styles.nuevoBoton, marginRight: 10 }} onPress={guardarTarea}>
                            <Text style={{ color: colors.textColorPrimary }}>Guardar</Text>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity style={{ ...styles.nuevoBoton, backgroundColor: editando ? '#444444' : colors.primary }} onPress={() => {
                        if (!editando) nuevoBoton()
                        else cancelar()
                    }}>
                        <Text style={{ color: colors.textColorPrimary }}>{editando ? 'Cancelar' : 'Nuevo'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {
                editando && <TextInput autoFocus style={styles.input} value={descrip} onChangeText={(text) => setDescrip(text)} onSubmitEditing={guardarTarea} />
            }

            <FlatList style={{ marginTop: 50 }} data={tareas} renderItem={({ item }) => <RenderTarea data={item} />} />

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    textTarea: {
        fontSize: 25
    },
    nuevoBoton: {
        borderRadius: 5,
        backgroundColor: colors.primary,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.accent,
        height: 40,
        marginHorizontal: '5%',
        paddingHorizontal: '3%',
        marginTop: 20
    },
    renderTarea: {
        marginHorizontal: '5%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})