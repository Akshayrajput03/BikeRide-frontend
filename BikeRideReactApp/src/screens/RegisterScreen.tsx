import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/axiosConfig'; // Import the Axios instance

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Registration Failed', 'Passwords do not match.');
      return;
    }

    try {
      const response = await api.post('/login/register', {
        name: name,
        username: username,
        email: email,
        password: password,
        mobileNum: mobileNumber, // Include mobile number in the request object
      });
        console.log('response:{}  ',response);
      if (response.status === 200 && response.data.resCode === '2000') {
        Alert.alert('Registration Successful', 'Registration Successful', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'), // Navigate to Login after closing the alert
          },
        ]);
      } else if (response.data.errorDesc) {
              // Show the specific error message received from the server
              Alert.alert('Registration Failed', response.data.errorDesc);
      }else {
        Alert.alert('Registration Failed', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F2FAFA', // Background color similar to PublicRidesScreen
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000', // Dark black text color
  },
  input: {
    height: 50,
    borderColor: '#000000', // Black border color
    borderWidth: 1,
    borderRadius: 25, // Rounded edges
    marginBottom: 20,
    paddingHorizontal: 15,
    color: '#000000', // Dark black text color
  },
  button: {
    backgroundColor: '#388E3C', // Green color similar to login button
    paddingVertical: 15,
    borderRadius: 25, // Rounded edges
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
