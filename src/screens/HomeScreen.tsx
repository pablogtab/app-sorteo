import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { colors } from '../theme/ColorTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackNavigatorParams } from '../navigation/HomeStackNavigator';
import { useSorteados } from '../hooks/useSorteados';

type Props = NativeStackScreenProps<HomeStackNavigatorParams, 'HomeScreen'>

export const HomeScreen = ({ route, navigation }: Props) => {

   const { historial, limpiarHistorial } = useSorteados()


   return (
      <SafeAreaView style={styles.container}>
         <View style={{ ...styles.container }}>
            <Text style={styles.textoInicial}>APP Sorteo</Text>
            <TouchableOpacity style={styles.boton} onPress={() => {
               navigation.navigate('SorteoScreen')
            }}>
               <Text style={styles.textoBoton}>Nuevo Sorteo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton} onPress={() => {
               navigation.navigate('UsuarioScreen')
            }}>
               <Text style={styles.textoBoton}>Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton} onPress={() => {
               navigation.navigate('TareaScreen')
            }}>
               <Text style={styles.textoBoton}>Tareas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton} onPress={() => {
               navigation.navigate('EstadisticasScreen')
            }}>
               <Text style={styles.textoBoton}>Estadísticas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton} onPress={() => {
               limpiarHistorial()
            }}>
               <Text style={styles.textoBoton}>Limpiar Historial</Text>
            </TouchableOpacity>
            {
               historial.length > 0 &&
               <View style={{ marginTop: 15, marginHorizontal: '5%' }}>
                  <FlatList scrollEnabled={false} data={historial} renderItem={({ item }) => {
                     return <Text style={{ fontSize: 16, marginBottom: 5 }}>{item.fecha} - {item.sorteados.map(u => u.usuario.nombre).join(' ')}</Text>
                  }}></FlatList>
               </View>
            }
         </View>

      </SafeAreaView>
   )
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   textoInicial: {
      textAlign: 'center',
      fontSize: 40,
      marginTop: 40
   },
   boton: {
      backgroundColor: colors.primary,
      width: '80%',
      alignSelf: 'center',
      marginTop: 40,
      height: 50,
      borderRadius: 5,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center'
   },
   textoBoton: {
      color: colors.textColorPrimary,
      fontSize: 20
   },
   resumenView: {
      marginTop: 40,
      marginHorizontal: '4%',
   }

})