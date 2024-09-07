import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/axiosConfig'; // Import the Axios instance

const ForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUsernameValidated, setIsUsernameValidated] = useState(false);

  const handleForgotPassword = async () => {
    try {
      // Send a request to the server to validate the username
      const response = await api.post('/login/checkUsername', { username });

      if (response.status === 200) {
        // Username is valid, show password reset fields
        setIsUsernameValidated(true);
        Alert.alert('Username Found', 'Please enter your new password.');
      } else {
        // Username is not found
        Alert.alert('Invalid Username', 'The username you entered does not exist.');
      }
    } catch (error) {
      Alert.alert('Validation Failed', 'An error occurred, please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match, please try again.');
      return;
    }

    try {
      // Send a request to the server to reset the password
      const response = await api.post('/login/forgot', {
        username,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password reset successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'), // Navigate to Login screen
          },
        ]);
      } else {
        Alert.alert('Reset Failed', 'An error occurred, please try again.');
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
        placeholderTextColor="#6D6D6D" // Darker gray for placeholder text
        value={username}
        onChangeText={setUsername}
        editable={!isUsernameValidated} // Disable editing after username validation
      />
      {isUsernameValidated && (
        <>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#6D6D6D"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#6D6D6D"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={isUsernameValidated ? handleResetPassword : handleForgotPassword}
      >
        <Text style={styles.buttonText}>
          {isUsernameValidated ? 'Reset Password' : 'Check Username'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F2FAFA', // Background color matching the PublicRidesScreen
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

export default ForgotPasswordScreen;
