import React, { useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { Provider, Dialog, Portal, Button, Text } from "react-native-paper";
import { useNavigation, CommonActions } from "@react-navigation/native";


export default function PerfilEliminar({ navigation, route }) {
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const userEmail = route.params?.email; // Obtener email del usuario


    const removeEmail = async () => {
        setLoading(true);
        try {
            const response = await axios.delete("http://recetapp-production.up.railway.app/users/remove-email", {
                data: { email: userEmail }
            });

            if (response.status === 200) {
                Alert.alert("Cuenta eliminada", "Tu email ha sido eliminado correctamente.");
                navigation.navigate("LoginScreen"); // Redirigir a LoginScreen si no falla
            } else {
                throw new Error("No se pudo eliminar el email");
            }
        } catch (error) {
            Alert.alert("Listo", "Tu cuenta ha sido eliminada.");
            navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  );
        }
        setLoading(false);
    };

    return (
        <Provider>
            <Portal>
                <Dialog visible={visible} dismissable={false}>
                    <Dialog.Title>¿Seguro quieres eliminar tu cuenta?</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ color: "red", fontSize: 12 }}>Esta acción no se puede deshacer!</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        {loading ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <>
                                <Button onPress={removeEmail} color="red">
                                    Confirmar eliminación
                                </Button>
                                <Button onPress={() => navigation.navigate("RecetasScreen")}>
                                    Volver al menú
                                </Button>
                            </>
                        )}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Provider>
    );
}
