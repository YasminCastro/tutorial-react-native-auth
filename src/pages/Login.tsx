import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister } = useAuth();

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.get(`${API_URL}/users`);

      console.log(result);
    };

    testCall();
  }, []);

  const login = async () => {
    const result = await onLogin!(email, password);

    if (result && result.error) {
      alert(result.message);
    }
  };

  const register = async () => {
    const result = await onRegister!(email, password);

    if (result && result.error) {
      alert(result.message);
    } else {
      login();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text: string) => {
            setEmail(text);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text: string) => {
            setPassword(text);
          }}
        />
        <Button onPress={login} title="Sign in" />
        <Button onPress={register} title="Create Account" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  form: { gap: 10, width: "60%" },

  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default Login;
