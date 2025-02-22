import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

export default function PerfilScreen({ navigation }) {
  const [email, setEmail] = useState('dev@gmail.com'); 
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  const handleSaveChanges = () => {
    if (!email.includes('@')) {
      Alert.alert('Error', 'Correo inválido.');
      return;
    }
    if (password && password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    Alert.alert('Éxito', 'Información actualizada correctamente.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Nueva Contraseña:</Text>
      <TextInput 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Deja en blanco para no cambiar"
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonOutlineText}>Ver Información de los Desarrolladores</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => Alert.alert('Guardados', 'Aquí irían las recetas guardadas, función descartada.')}>
        <Text style={styles.buttonOutlineText}>Mis Recetas Guardadas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modal de Términos y Condiciones */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ver Información de los Desarrolladores</Text>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>
             Hecho por: Luis Vargas y Daniel Vaimberg 
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF5E1',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF7F50',
    textAlign: 'center',
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    color: '#FF7F50',
    fontWeight: '600',
    marginBottom: 2,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#FFA07A',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF4500',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonOutline: {
    width: '100%',
    borderColor: '#FF7F50',
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonOutlineText: {
    color: '#FF7F50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#D9534F',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF5E1',
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF7F50',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
  },
});

