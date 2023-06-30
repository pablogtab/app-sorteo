import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/ColorTheme';
import { useSorteados } from '../hooks/useSorteados';
import { useState } from 'react';
import { Tarea } from '../interfaces/Tarea';
import { Usuario } from '../interfaces/Usuario';

import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withTiming,
   useDerivedValue,
   interpolate,
} from 'react-native-reanimated';


type ConCantidad<T> = T & { cantidad: number }

type TareasXUsuario = ConCantidad<Tarea> & { usuarios: ConCantidad<Usuario>[] }
type UsuariosXTarea = ConCantidad<Usuario> & { tareas: ConCantidad<Tarea>[] }

export const EstadisticasScreen = () => {

   const { historial } = useSorteados()

   const [tareasHistorial, setTareas] = useState<TareasXUsuario[]>([])
   const [usuariosHistorial, setUsuarios] = useState<UsuariosXTarea[]>([])


   useEffect(() => {
      if (historial && historial.length) {
         let tmpTareas = historial.reduce((tareasAcumuladas: Tarea[], historial) => {
            let tmpTareas2: Tarea[] = []
            historial.sorteados.forEach((s) => {
               let tarea = tareasAcumuladas.find(t => t.idTarea === s.tarea.idTarea)
               if (!tarea) {
                  tmpTareas2.push(s.tarea)
               }
            })
            return [...tareasAcumuladas, ...tmpTareas2]
         }, [])

         let tareasConCantidad: TareasXUsuario[] = tmpTareas.map(t => { return { ...t, cantidad: 0, usuarios: [] } })

         let usuarios = historial.reduce((usuariosAcumulados: Usuario[], historial) => {
            let tmpUsuarios2: Usuario[] = []
            historial.sorteados.forEach((s) => {
               let usuario = usuariosAcumulados.find(u => u.idUsuario === s.usuario.idUsuario)
               if (!usuario) {
                  tmpUsuarios2.push(s.usuario)
               }
            })
            return [...usuariosAcumulados, ...tmpUsuarios2]
         }, [])



         historial.forEach(h => {
            h.sorteados.forEach((s) => {
               let usuario = usuarios.find(u => s.usuario.idUsuario === u.idUsuario)
               let tareaIndex = tareasConCantidad.findIndex(t => t.idTarea === s.tarea.idTarea)
               tareasConCantidad[tareaIndex].cantidad += 1;

               let usuarioXTareaIndex = tareasConCantidad[tareaIndex].usuarios.findIndex(u => u.idUsuario === usuario.idUsuario)
               if (usuarioXTareaIndex > -1) {
                  tareasConCantidad[tareaIndex].usuarios[usuarioXTareaIndex].cantidad += 1
               } else {
                  tareasConCantidad[tareaIndex].usuarios.push({ ...usuario, cantidad: 1 })
               }
            })
         })

         let usuariosConCantidad: UsuariosXTarea[] = usuarios.map(u => { return { ...u, cantidad: 0, tareas: [] } })

         historial.forEach(h => {
            h.sorteados.forEach((s) => {
               let tarea = tareasConCantidad.find(t => t.idTarea === s.tarea.idTarea)
               delete tarea.usuarios
               let userIndex = usuariosConCantidad.findIndex(u => u.idUsuario === s.usuario.idUsuario)
               usuariosConCantidad[userIndex].cantidad += 1

               let tareaXUsuarioIndex = usuariosConCantidad[userIndex].tareas.findIndex(t => t.idTarea === tarea.idTarea)
               if (tareaXUsuarioIndex > -1) {
                  usuariosConCantidad[userIndex].tareas[tareaXUsuarioIndex].cantidad += 1
               } else {
                  usuariosConCantidad[userIndex].tareas.push({ ...tarea, cantidad: 1 })
               }
            })
         })

         setUsuarios(usuariosConCantidad)
         setTareas(tareasConCantidad)

      }
   }, [historial])

   const RenderGraficoUsuario = ({ data: user }: { data: UsuariosXTarea }) => {



      const RenderBar = ({ tarea, index }: { tarea: ConCantidad<Tarea>, index: number }) => {

         const offset = useSharedValue(0);

         const animatedStyles = useAnimatedStyle(() => {
            return {
               height: offset.value * tarea.cantidad / user.cantidad + '%'
            };
         });

         useEffect(() => {
            offset.value = withTiming(75, { duration: 500 })
         }, [])

         return (
            <Animated.View style={[styles.barGraficoUsuario, { backgroundColor: colores[index] }, animatedStyles,]}>
               <Text style={{ position: 'absolute', bottom: -20, left: 0, right: 0, textAlign: 'center' }}>{tarea.descripcion}</Text>
               <Text style={{ position: 'absolute', top: -20, left: 0, right: 0, textAlign: 'center' }}>{tarea.cantidad  + ''}</Text>
            </Animated.View>
         )
      }

      return (
         <View style={styles.graficoUsuarioContainer}>
            <View style={styles.graphicTail} />
            <Text style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', fontSize: 20 }}>{user.nombre}</Text>
            {
               user.tareas.length > 0 && <>
                  {user.tareas.map((tarea, index) => <RenderBar index={index} tarea={tarea} key={tarea.idTarea} />)}
               </>
            }

         </View>)
   }

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView style={{ ...styles.container, height: '100%' }}>

            {
               usuariosHistorial.length > 0 &&
               <>
                  {
                     usuariosHistorial.map((user) => {
                        return <RenderGraficoUsuario key={user.idUsuario} data={user} />
                     })
                  }
               </>
            }
            <View style={{ height: 200 }}></View>
         </ScrollView>
      </SafeAreaView>
   )
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   graficoUsuarioContainer: {
      marginBottom: 50,
      width: '90%',
      height: 300,
      marginHorizontal: '5%',
      marginTop: 20,
      borderWidth: 2,
      borderTopWidth: 0,
      borderRightWidth: 0,
      flexDirection: 'row',
      alignItems: 'flex-end'
   },
   graphicTail: {
      position: 'absolute',
      width: '3%',
      height: '4%',
      borderWidth: 2,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      bottom: '-4%',
      left: '-3%'
   },
   barGraficoUsuario: {
      marginHorizontal: '2%',
      flex: 1,
   },
   nombreTareaGraficoUsuario: {
      position: 'absolute',
      bottom: -20,
      left: 0,
      right: 0,
      textAlign: 'center'
   }
})



var colores = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE'];
