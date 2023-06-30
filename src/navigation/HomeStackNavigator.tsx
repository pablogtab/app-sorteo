import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { HomeScreen } from '../screens/HomeScreen';
import { UsuarioScreen } from '../screens/UsuarioScreen';
import { TareaScreen } from '../screens/TareaScreen';
import { SorteoScreen } from '../screens/SorteoScreen';
import { EstadisticasScreen } from '../screens/EstadisticasScreen';


export type HomeStackNavigatorParams = {
    HomeScreen: undefined
    UsuarioScreen: undefined
    TareaScreen: undefined
    SorteoScreen: undefined
    EstadisticasScreen: undefined
}

const Stack = createNativeStackNavigator<HomeStackNavigatorParams>();

export const HomeStackNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="UsuarioScreen" component={UsuarioScreen} />
            <Stack.Screen name="TareaScreen" component={TareaScreen} />
            <Stack.Screen name="SorteoScreen" component={SorteoScreen} />
            <Stack.Screen name="EstadisticasScreen" component={EstadisticasScreen} />
        </Stack.Navigator>
    );
}

