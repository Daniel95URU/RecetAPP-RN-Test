import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function AgregarRecetaScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [comensales, setComensales] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [ingredientes, setIngredientes] = useState(['']);
  const [pasos, setPasos] = useState(['']);
  const [imagen, setImagen] = useState(null);

  const handleAgregarReceta = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado');
        return;
      }

      // Validar que todos los campos tengan valores válidos
      if (!nombre || !descripcion || !comensales || !tiempo || ingredientes.length === 0 || pasos.length === 0) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }

      // Convertir ingredientes y pasos a JSON
      const ingredientesJSON = JSON.stringify(ingredientes);
      const pasosJSON = JSON.stringify(pasos);

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('comensales', comensales);
      formData.append('tiempo', tiempo);
      formData.append('ingredientes', ingredientesJSON);
      formData.append('pasos', pasosJSON);
      if (imagen) {
        formData.append('imagen', {
          uri: imagen.uri,
          type: imagen.type || 'image/jpeg',  // Asegurar tipo de imagen
          name: imagen.fileName || 'imagen.jpg',
        });
      }

      const response = await axios.post('https://recetapp-production.up.railway.app/api/recipes', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta del servidor:', response.data);
      Alert.alert('Éxito', 'Receta agregada exitosamente');
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.error('Error del servidor:', error.response.data);
        Alert.alert('Error', `Servidor: ${error.response.data.message || 'Error desconocido'}`);
      } else {
        console.error('Error al agregar la receta:', error.message);
        Alert.alert('Error', 'Hubo un problema al agregar la receta. Intenta de nuevo.');
      }
    }
  };

  const requestStoragePermission = async () => {
    try {
      console.log('Solicitando permiso de almacenamiento...');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permiso de almacenamiento',
          message: 'Esta aplicación necesita acceso a tu almacenamiento para seleccionar imágenes.',
          buttonNeutral: 'Preguntar más tarde',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        },
      );
      console.log('Permiso concedido:', granted === PermissionsAndroid.RESULTS.GRANTED);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleSeleccionarImagen = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permiso denegado', 'No se concedió el permiso de almacenamiento');
        return;
      }
    }

    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la selección de imagen');
      } else if (response.error) {
        console.log('Error en ImagePicker:', response.error);
      } else {
        const source = response.assets ? response.assets[0] : null;
        if (source) {
          console.log('Imagen seleccionada:', source);
          setImagen(source);
        }
      }
    });
  };

  const handleAgregarIngrediente = () => {
    setIngredientes([...ingredientes, '']);
  };

  const handleEliminarIngrediente = (index) => {
    const newIngredientes = ingredientes.filter((_, i) => i !== index);
    setIngredientes(newIngredientes);
  };

  const handleIngredienteChange = (text, index) => {
    const newIngredientes = [...ingredientes];
    newIngredientes[index] = text;
    setIngredientes(newIngredientes);
  };

  const handleAgregarPaso = () => {
    setPasos([...pasos, '']);
  };

  const handleEliminarPaso = (index) => {
    const newPasos = pasos.filter((_, i) => i !== index);
    setPasos(newPasos);
  };

  const handlePasoChange = (text, index) => {
    const newPasos = [...pasos];
    newPasos[index] = text;
    setPasos(newPasos);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Receta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la receta"
        value={nombre}
        onChangeText={setNombre}
        maxLength={50}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Comensales"
        value={comensales}
        onChangeText={setComensales}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Tiempo de elaboración"
        value={tiempo}
        onChangeText={setTiempo}
        maxLength={10}
        keyboardType="numeric"
      />

      <Text style={styles.subtitle}>Ingredientes</Text>
      {ingredientes.map((ingrediente, index) => (
        <View key={index} style={styles.ingredienteContainer}>
          <TextInput
            style={[styles.input, styles.ingredienteInput]}
            placeholder={`Ingrediente ${index + 1}`}
            value={ingrediente}
            onChangeText={(text) => handleIngredienteChange(text, index)}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleEliminarIngrediente(index)}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAgregarIngrediente}>
        <Text style={styles.buttonText}>Agregar Ingrediente</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Pasos</Text>
      {pasos.map((paso, index) => (
        <View key={index} style={styles.pasoContainer}>
          <TextInput
            style={[styles.input, styles.pasoInput]}
            placeholder={`Paso ${index + 1}`}
            value={paso}
            onChangeText={(text) => handlePasoChange(text, index)}
            multiline
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleEliminarPaso(index)}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAgregarPaso}>
        <Text style={styles.buttonText}>Agregar Paso</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSeleccionarImagen}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {imagen && (
        <Image source={{ uri: imagen.uri }} style={styles.image} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAgregarReceta}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E1',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF7F50',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF7F50',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#FFA07A',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  ingredienteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  ingredienteInput: {
    flex: 1,
  },
  pasoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  pasoInput: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    backgroundColor: '#FF4500',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FF7F50',
  },
});
