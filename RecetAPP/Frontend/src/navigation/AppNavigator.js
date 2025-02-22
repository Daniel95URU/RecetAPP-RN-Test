import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons"; 

import LoginScreen from "../screens/auth/LoginScreen";
import RecetasScreen from "../screens/RecetasScreen";
import SpoonacularScreen from "../screens/SpoonacularScreen";
import AgregarRecetaScreen from "../screens/AgregarRecetaScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import GruposScreen from "../screens/GruposScreen";
import PerfilScreen from "../screens/PerfilScreen";
import AgregarRecetaGrupo from "../screens/AgregarRecetaGrupo";
import DetalleRecetaScreen from "../screens/DetalleRecetaScreen";
import PerfilEliminar from "../screens/PerfilEliminar";
import EditarReceta from "../screens/EditarReceta";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function PerfilDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: "#fff" },
        drawerActiveTintColor: "#f57c00",
        drawerInactiveTintColor: "#333",
      }}
    >
      <Drawer.Screen name="Mi Perfil" component={PerfilScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} /> }} />
      <Drawer.Screen name="Eliminar Cuenta" component={PerfilEliminar} options={{ drawerIcon: ({ color }) => <Ionicons name="trash" size={24} color={color} /> }} />
    </Drawer.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#f57c00", borderTopLeftRadius: 15, borderTopRightRadius: 15, height: 60 },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#ffd699",
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", paddingBottom: 5 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Recetas") iconName = "book-outline";
          else if (route.name === "Descubrir") iconName = "search";
          else if (route.name === "Grupos") iconName = "people-outline";
          else if (route.name === "Perfil") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Recetas" component={RecetasScreen} />
      <Tab.Screen name="Descubrir" component={SpoonacularScreen} />
      <Tab.Screen name="Grupos" component={GruposScreen} />
      <Tab.Screen name="Perfil" component={PerfilDrawer} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#f57c00", elevation: 1, shadowOpacity: 2 },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Editar" component={EditarReceta} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AgregarRecetaGrupo" component={AgregarRecetaGrupo} options={{ title: "Detalles de la receta", headerStyle: { backgroundColor: "#f57c00" } }} />
        <Stack.Screen name="AgregarReceta" component={AgregarRecetaScreen} options={{ title: "", headerStyle: { backgroundColor: "#ff9800" } }} />
        <Stack.Screen name="DetalleReceta" component={DetalleRecetaScreen} options={{ title: "Detalles de la receta", headerStyle: { backgroundColor: "#f57c00" } }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
