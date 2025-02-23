import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, Pressable, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function RecetasScreen({ navigation }) {
  const [tab, setTab] = useState('Mis Recetas'); // Controla la pestaña activa
  const [recetas, setRecetas] = useState([]);
  const [publicRecetas, setPublicRecetas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRecetas, setFilteredRecetas] = useState([]);
  const [filteredPublicRecetas, setFilteredPublicRecetas] = useState([]);

  const API_KEY = 'TU_SPOONACULAR_API_KEY'; // Reemplázala con tu clave

  // Fetch de recetas personales
  const fetchRecetas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('https://recetapp-production.up.railway.app/api/recipes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecetas(response.data);
        setFilteredRecetas(response.data);
      }
    } catch (error) {
      console.error("Error fetching recetas personales", error);
    }
  };

  // Fetch de recetas públicas desde Spoonacular
  const fetchPublicRecetas = async () => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`);
      setPublicRecetas(response.data.recipes);
      setFilteredPublicRecetas(response.data.recipes);
    } catch (error) {
      console.error("Error fetching recetas públicas", error);
    }
  };

  useFocusEffect(useCallback(() => { fetchRecetas(); }, []));
  useEffect(() => { fetchPublicRecetas(); }, []);

  // Filtrar recetas según búsqueda
  useEffect(() => {
    if (searchText === '') {
      setFilteredRecetas(recetas);
      setFilteredPublicRecetas(publicRecetas);
    } else {
      setFilteredRecetas(recetas.filter(r => r.nombre.toLowerCase().includes(searchText.toLowerCase())));
      setFilteredPublicRecetas(publicRecetas.filter(r => r.title.toLowerCase().includes(searchText.toLowerCase())));
    }
  }, [searchText, recetas, publicRecetas]);

  // Función para eliminar receta
  const eliminarReceta = async (recetaId) => {
    Alert.alert(
      "Eliminar Receta",
      "¿Estás seguro de que deseas eliminar esta receta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`https://recetapp-production.up.railway.app/api/recipes/${recetaId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchRecetas(); // Recargar lista tras eliminar
            } catch (error) {
              console.error("Error eliminando receta", error);
            }
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  // Tarjeta para recetas personales
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('DetalleReceta', { receta: item })}>
      {item.imagen && <Image source={{ uri: `https://recetapp-production.up.railway.app${item.imagen}` }} style={styles.recipeImage} />}
      <Text style={styles.recipeTitle}>{item.nombre}</Text>
      <Text>{item.descripcion}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditarReceta', { recetaId: item._id })}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarReceta(item._id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Tarjeta para recetas públicas de Spoonacular
  const renderPublicItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('DetalleRecetaPublica', { receta: item })}>
      {item.image && <Image source={{ uri: item.image }} style={styles.recipeImage} />}
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text>Tiempo: {item.readyInMinutes} min</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'Mis Recetas' && styles.activeTab]} onPress={() => setTab('Mis Recetas')}>
          <Text style={[styles.tabText, tab === 'Mis Recetas' && styles.activeTabText]}>Mis Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'Recetas Públicas' && styles.activeTab]} onPress={() => setTab('Recetas Públicas')}>
          <Text style={[styles.tabText, tab === 'Recetas Públicas' && styles.activeTabText]}>Recetas Públicas</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <TextInput style={styles.searchInput} placeholder="🔎 Buscar recetas..." value={searchText} onChangeText={setSearchText} />

      {/* Lista de recetas según la pestaña activa */}
      {tab === 'Mis Recetas' ? (
        <FlatList data={filteredRecetas} renderItem={renderItem} keyExtractor={(item) => item._id} />
      ) : (
        <FlatList data={filteredPublicRecetas} renderItem={renderPublicItem} keyExtractor={(item) => item.id.toString()} />
      )}

      {/* Botón flotante para agregar recetas personales */}
      {tab === 'Mis Recetas' && (
        <Pressable style={styles.fab} onPress={() => navigation.navigate('AgregarReceta')}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF5E1' },
  tabs: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  tab: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#FFA07A', borderRadius: 8 },
  activeTab: { backgroundColor: '#FF4500' },
  tabText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  activeTabText: { color: '#FFF5E1' },
  searchInput: { height: 40, borderColor: '#FFA07A', borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 10, marginBottom: 20, backgroundColor: '#fff' },
  recipeCard: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10, borderRadius: 8, backgroundColor: '#f9f9f9' },
  recipeImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF4500' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: { backgroundColor: '#FFD859', padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
  deleteButton: { backgroundColor: '#FF4D4D', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#FFD859', borderRadius: 30, elevation: 8 },
  fabText: { fontSize: 24, color: '#fff' },
});
// estaba bien Luis, todo era el backend
