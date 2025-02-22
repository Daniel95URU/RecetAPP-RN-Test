import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditarReceta = ({ route, navigation }) => {
  const { recetaId } = route.params; 

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [comensales, setComensales] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`https://recetapp-production.up.railway.app/api/recipes/${recetaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const receta = response.data;
        setNombre(receta.nombre);
        setDescripcion(receta.descripcion);
        setComensales(String(receta.comensales));
        setTiempo(String(receta.tiempo));
        setIngredientes(receta.ingredientes.join(', '));
        setPasos(receta.pasos.join('. '));
      } catch (error) {
        console.error("Error cargando la receta", error);
      }
    };

    fetchReceta();
  }, [recetaId]);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `https://recetapp-production.up.railway.app/api/recipes/${recetaId}`,
        {
          nombre,
          descripcion,
          comensales: Number(comensales),
          tiempo: Number(tiempo),
          ingredientes: ingredientes.split(',').map(i => i.trim()),
          pasos: pasos.split('.').map(p => p.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Éxito", "Receta actualizada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error guardando la receta", error);
      Alert.alert("Error", "No se pudo guardar la receta. Intenta de nuevo.");
    }
  };

  // Eliminar receta
  const handleDelete = async () => {
    Alert.alert("Eliminar Receta", "¿Estás seguro de que quieres eliminar esta receta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`https://recetapp-production.up.railway.app/api/recipes/${recetaId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Eliminada", "La receta fue eliminada con éxito", [
              { text: "OK", onPress: () => navigation.goBack() }
            ]);
          } catch (error) {
            console.error("Error eliminando la receta", error);
            Alert.alert("Error", "No se pudo eliminar la receta. Intenta de nuevo.");
          }
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Receta</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />

      <TextInput style={styles.input} placeholder="Comensales" value={comensales} onChangeText={setComensales} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Tiempo de elaboración (min)" value={tiempo} onChangeText={setTiempo} keyboardType="numeric" />

      <TextInput style={styles.input} placeholder="Ingredientes (separados por comas)" value={ingredientes} onChangeText={setIngredientes} multiline />
      <TextInput style={styles.input} placeholder="Pasos (separados por puntos)" value={pasos} onChangeText={setPasos} multiline />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Eliminar Receta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF5E1' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#FF4500' },
  input: { height: 50, borderColor: '#FFA07A', borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#fff' },
  saveButton: { backgroundColor: '#FF4500', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  deleteButton: { backgroundColor: '#FF6347', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default EditarReceta;
