import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api/axiosConfig'; // Import the Axios instance

const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState('');

  const handleForgotPassword = async () => {
    try {
      // Send a request to the server to validate the username
      const response = await api.post('/login/forgot', {
        username: username,
      });

      if (response.status === 200) {
        // Username is valid, proceed with password reset
        Alert.alert('Username Found', 'Please check your email for password reset instructions.');
        // Optionally, you can trigger a password reset email here
      } else {
        // Username is not found
        Alert.alert('Invalid Username', 'The username you entered does not exist.');
      }
    } catch (error) {
      Alert.alert('Reset Failed', 'An error occurred, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Check Username" onPress={handleForgotPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ForgotPasswordScreen;
