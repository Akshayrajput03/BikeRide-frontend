import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  ImageBackground
} from 'react-native';
import api from '../api/axiosConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const buttonAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/login/user', {
        username,
        password,
      });
      if (response.status === 200) {
        const { id, username } = response.data;
        navigation.navigate('RidesTabs', { id, username }); // Pass id and username
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'An error occurred');
    }
    setLoading(false);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();
  };

  return (
    <ImageBackground
      source={require('../assets/background-image.jpg')} // Replace with your background image path
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            placeholderTextColor="#6D6D6D" // Darker gray for placeholder text
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6D6D6D" // Darker gray for placeholder text
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              animateButton();
              handleLogin();
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.linkButtonText}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Adjusts the size of the image to cover the entire screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(169, 169, 169, 0.6)', // Light grey background with opacity
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000', // Dark black text color
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50, // Increased input box height
    borderColor: '#000000', // Black border color
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded edges
    color: '#000000', // Dark black text color
  },
  button: {
    backgroundColor: '#388E3C', // Darker green for the button
    paddingVertical: 15,
    borderRadius: 25, // Rounded edges
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#000000', // Dark black for the link text
    fontSize: 18, // Larger text size for links
    fontWeight: 'bold',
  },
});

export default LoginScreen;
