import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

export default function SpoonacularScreen() {
  const [recetas, setRecetas] = useState([]);
  const API_KEY = '8ef8c4c56b3e4c79ba1285821d69d839';

  useEffect(() => {
    fetchRecetas();
  }, []);

  const fetchRecetas = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`
      );
      setRecetas(response.data.recipes);
    } catch (error) {
      console.error("Error al obtener recetas", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recetas de Spoonacular</Text>
      <FlatList
        data={recetas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Text style={styles.subtitle}>Ingredientes:</Text>
            {item.extendedIngredients?.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>
                • {ingredient.original}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.button}
              onPress={() => alert(`Tiempo de preparación: ${item.readyInMinutes} min`)}
            >
              <Text style={styles.buttonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF5E1' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  recipeCard: { backgroundColor: '#FFE4C4', borderRadius: 10, padding: 15, marginBottom: 20 },
  recipeImage: { width: '100%', height: 200, borderRadius: 10 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  ingredient: { fontSize: 14, marginLeft: 10 },
  button: { backgroundColor: '#FF4500', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});
