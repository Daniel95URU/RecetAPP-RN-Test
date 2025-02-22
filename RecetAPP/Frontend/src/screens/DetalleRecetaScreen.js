import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const DetalleRecetaScreen = ({ route }) => {
  const { receta } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{receta.nombre}</Text>
      {receta.imagen && (
        <Image source={{ uri: `https://recetapp-production.up.railway.app${receta.imagen}` }} style={styles.image} />
      )}
      <Text style={styles.subtitle}>Descripción</Text>
      <Text style={styles.text}>{receta.descripcion}</Text>
      <Text style={styles.subtitle}>Tiempo de elaboración</Text>
      <Text style={styles.text}>{receta.tiempo} minutos</Text>
      <Text style={styles.subtitle}>Comensales</Text>
      <Text style={styles.text}>{receta.comensales}</Text>
      <Text style={styles.subtitle}>Ingredientes</Text>
      {receta.ingredientes && receta.ingredientes.map((ingrediente, index) => (
        <Text key={index} style={styles.text}>- {ingrediente}</Text>
      ))}
      <Text style={styles.subtitle}>Pasos</Text>
      {receta.pasos && receta.pasos.map((paso, index) => (
        <Text key={index} style={styles.text}>{index + 1}. {paso}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF5E1', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF7F50', 
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFA07A', 
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500', 
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  text: {
    fontSize: 17,
    color: '#333', // Texto oscuro para mejor contraste
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2, // Pequeña sombra para resaltar
    marginBottom: 10,
  },
});

export default DetalleRecetaScreen;