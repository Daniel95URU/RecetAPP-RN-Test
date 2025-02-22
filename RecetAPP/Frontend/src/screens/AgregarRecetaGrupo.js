import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AgregarRecetaGrupo({ route, navigation }) {
  const { grupo } = route.params; // Recibe el grupo desde la navegación
  const [recetas, setRecetas] = useState([]);
  const [recetasGrupo, setRecetasGrupo] = useState([]);

  useEffect(() => {
    cargarRecetas();
    cargarRecetasGrupo();
  }, []);

  const cargarRecetas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('https://recetapp-production.up.railway.app/api/recipes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecetas(response.data);
      }
    } catch (error) {
      console.error("Error al obtener recetas", error);
    }
  };

  const cargarRecetasGrupo = async () => {
    try {
      const data = await AsyncStorage.getItem(`grupo_${grupo.nombre}`);
      if (data) {
        setRecetasGrupo(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error al cargar recetas del grupo", error);
    }
  };

  const agregarReceta = async (receta) => {
    if (recetasGrupo.some(r => r._id === receta._id)) {
      Alert.alert("Aviso", "Esta receta ya está en el grupo.");
      return;
    }

    const nuevasRecetas = [...recetasGrupo, receta];
    setRecetasGrupo(nuevasRecetas);
    await AsyncStorage.setItem(`grupo_${grupo.nombre}`, JSON.stringify(nuevasRecetas));
  };

  const eliminarReceta = async (recetaId) => {
    const nuevasRecetas = recetasGrupo.filter(r => r._id !== recetaId);
    setRecetasGrupo(nuevasRecetas);
    await AsyncStorage.setItem(`grupo_${grupo.nombre}`, JSON.stringify(nuevasRecetas));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas en {grupo.nombre}</Text>
      <FlatList
        data={recetasGrupo}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeName}>{item.nombre}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarReceta(item._id)}>
              <Text style={styles.buttonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.subtitle}>Agregar Recetas</Text>
      <FlatList
        data={recetas}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.addRecipeCard} onPress={() => agregarReceta(item)}>
            <Text style={styles.recipeName}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF5E1' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  recipeCard: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#FFDDC1', borderRadius: 8, marginBottom: 10 },
  addRecipeCard: { padding: 10, backgroundColor: '#FFD859', borderRadius: 8, marginBottom: 10 },
  recipeName: { fontSize: 16 },
  deleteButton: { backgroundColor: '#FF6347', padding: 8, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  backButton: { backgroundColor: '#FF4500', padding: 10, borderRadius: 8, marginTop: 20, alignItems: 'center' }
});
