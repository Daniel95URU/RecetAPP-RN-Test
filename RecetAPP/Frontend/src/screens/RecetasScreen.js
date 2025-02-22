import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, Pressable, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Modal, Alert 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function RecetasScreen({ navigation }) {
  const [tab, setTab] = useState('Mis Recetas'); 
  const [recetas, setRecetas] = useState([]);
  const [publicRecetas, setPublicRecetas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRecetas, setFilteredRecetas] = useState([]);
  const [filteredPublicRecetas, setFilteredPublicRecetas] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);
  
  const API_KEY = '8ef8c4c56b3e4c79ba1285821d69d839';  //spoonacular no funciona

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

  useEffect(() => {
    if (searchText === '') {
      setFilteredRecetas(recetas);
      setFilteredPublicRecetas(publicRecetas);
    } else {
      setFilteredRecetas(recetas.filter(r => r.nombre.toLowerCase().includes(searchText.toLowerCase())));
      setFilteredPublicRecetas(publicRecetas.filter(r => r.title.toLowerCase().includes(searchText.toLowerCase())));
    }
  }, [searchText, recetas, publicRecetas]);

  const openEditModal = (receta) => {
    setSelectedReceta({ ...receta });
    setModalVisible(true);
  };

  const handleEditChange = (field, value) => {
    setSelectedReceta((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `https://recetapp-production.up.railway.app/api/recipes/${selectedReceta._id}`,
        { 
          nombre: selectedReceta.nombre,
          descripcion: selectedReceta.descripcion,
          comensales: Number(selectedReceta.comensales),
          tiempo: Number(selectedReceta.tiempo)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecetas((prev) => prev.map(r => r._id === selectedReceta._id ? selectedReceta : r));
      setFilteredRecetas((prev) => prev.map(r => r._id === selectedReceta._id ? selectedReceta : r));
      setModalVisible(false);
    } catch (error) {
      console.error("Error guardando cambios", error);
      Alert.alert("Error", "No se pudo actualizar la receta.");
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Eliminar Receta", "¿Seguro que quieres eliminar esta receta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive", onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`https://recetapp-production.up.railway.app/api/recipes/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setRecetas((prev) => prev.filter(r => r._id !== id));
            setFilteredRecetas((prev) => prev.filter(r => r._id !== id));
          } catch (error) {
            console.error("Error eliminando receta", error);
            Alert.alert("Error", "No se pudo eliminar la receta.");
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard}>
      {item.imagen && <Image source={{ uri: `https://recetapp-production.up.railway.app${item.imagen}` }} style={styles.recipeImage} />}
      <Text style={styles.recipeTitle}>{item.nombre}</Text>
      <Text>{item.descripcion}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="🔎 Buscar recetas..." value={searchText} onChangeText={setSearchText} />
      <FlatList data={filteredRecetas} renderItem={renderItem} keyExtractor={(item) => item._id} />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('AgregarReceta')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Modal de Edición */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Receta</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={selectedReceta?.nombre} onChangeText={(text) => handleEditChange('nombre', text)} />
            <TextInput style={styles.input} placeholder="Descripción" value={selectedReceta?.descripcion} onChangeText={(text) => handleEditChange('descripcion', text)} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF5E1',  },
  searchInput: { height: 40, borderColor: '#FFA07A', borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 10, marginBottom: 20, backgroundColor: '#fff' },
  recipeCard: { padding: 10, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  recipeImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF4500' },
  editButton: { backgroundColor: '#FFD859', padding: 10, borderRadius: 8, marginTop: 5 },
  deleteButton: { backgroundColor: '#FF6347', padding: 10, borderRadius: 8, marginTop: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  fab: { position: 'absolute', bottom: 20, left: 157, backgroundColor: '#FF4500', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 24, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'  }
});
