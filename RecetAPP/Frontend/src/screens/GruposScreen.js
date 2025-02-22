import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet, Animated, Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GruposScreen({ navigation }) {
  const [grupos, setGrupos] = useState([]);
  const [nuevoGrupo, setNuevoGrupo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    cargarGrupos();
    iniciarAnimacion();
  }, []);

  const iniciarAnimacion = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: -10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  const cargarGrupos = async () => {
    const data = await AsyncStorage.getItem('grupos');
    if (data) setGrupos(JSON.parse(data));
  };

  const guardarGrupos = async (nuevosGrupos) => {
    await AsyncStorage.setItem('grupos', JSON.stringify(nuevosGrupos));
    setGrupos(nuevosGrupos);
  };

  const agregarGrupo = () => {
    if (nuevoGrupo.trim() !== '') {
      const nuevosGrupos = [...grupos, { nombre: nuevoGrupo, recetas: [] }];
      guardarGrupos(nuevosGrupos);
      setNuevoGrupo('');
      setModalVisible(false);
    }
  };

  const eliminarGrupo = (index) => {
    const nuevosGrupos = grupos.filter((_, i) => i !== index);
    guardarGrupos(nuevosGrupos);
  };

  const abrirGrupo = (grupo) => {
    navigation.navigate('AgregarRecetaGrupo', { grupo });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={grupos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.groupCard} onPress={() => abrirGrupo(item)}>
            <Text style={styles.groupTitle}>{item.nombre}</Text>
            <TouchableOpacity onPress={() => eliminarGrupo(index)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      
      <Animated.View style={[styles.fabContainer, { transform: [{ translateY: animatedValue }] }]}>      
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Grupo</Text>
            <TextInput style={styles.input} placeholder="Nombre del Grupo" value={nuevoGrupo} onChangeText={setNuevoGrupo} />
            <TouchableOpacity style={styles.saveButton} onPress={agregarGrupo}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF5E1' },
  groupCard: { padding: 15, backgroundColor: '#FFDDC1', marginBottom: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' },
  groupTitle: { fontSize: 18, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#FF6347', padding: 8, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  fabContainer: { position: 'absolute', bottom: 30, right: 20 },
  fab: { width: 60, height: 60, backgroundColor: '#FF4500', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#FFA07A', padding: 10, borderRadius: 8, marginBottom: 10 },
  saveButton: { backgroundColor: '#FFD859', padding: 10, borderRadius: 8, marginBottom: 5 },
  closeButton: { backgroundColor: '#FF6347', padding: 10, borderRadius: 8 },
});
