import React, { createRef, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, FlatList, ListRenderItem, FlatListProps, TextInput } from 'react-native';
import { colors } from '../theme/ColorTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackNavigatorParams } from '../navigation/HomeStackNavigator';
import { useUsuarios } from '../hooks/useUsuarios';
import { Usuario } from '../interfaces/Usuario';
import * as Crypto from 'expo-crypto';

type Props = NativeStackScreenProps<HomeStackNavigatorParams, 'UsuarioScreen'>

export const UsuarioScreen = ({ route, navigation }: Props) => {


    const { usuarios, nuevoUsuario, eliminarUsuario } = useUsuarios()
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

    const guardarUsuario = () => {
        if (descrip) {
            setEditando(false)

            nuevoUsuario({ idUsuario: Crypto.randomUUID(), nombre: descrip })
        }
    }

    const RenderUsuario = ({ data }: { data: Usuario }) => {
        return <View style={styles.renderUsuario}>
            <Text style={{fontSize:19}}>{data.nombre}</Text>
            <TouchableOpacity onPress={() => eliminarUsuario(data)}>
                <Text>Eliminar</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: '5%', justifyContent: 'space-between' }}>
                <Text style={styles.textUsuario}>Usuarios</Text>
                <View style={{ flexDirection: 'row' }}>
                    {
                        editando &&
                        <TouchableOpacity style={{ ...styles.nuevoBoton, marginRight: 10 }} onPress={guardarUsuario}>
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
                editando && <TextInput autoFocus style={styles.input} value={descrip} onChangeText={(text) => setDescrip(text)} onSubmitEditing={guardarUsuario} />
            }

            <FlatList style={{ marginTop: 50 }} data={usuarios} renderItem={({ item }) => <RenderUsuario data={item} />} />
   
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    textUsuario: {
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
    renderUsuario: {
        marginHorizontal: '5%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})