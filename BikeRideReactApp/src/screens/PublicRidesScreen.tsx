// src/screens/PublicRidesScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import api from '../api/axiosConfig'; // Import the Axios instance
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // Adjust path as needed

interface RideEvent {
  id: number;
  rideName: string;
  location: string;
  date: string;
  time: string;
  username: string;
}

interface PublicRidesScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PublicRides'>; // Adjust screen name
}

const PublicRidesScreen: React.FC<PublicRidesScreenProps> = ({ navigation }) => {
  const [rides, setRides] = useState<RideEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get('/ride/publicRide'); // Fetch public rides
        setRides(response.data.data); // Assuming data is inside 'data' object in the response
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'An error occurred while fetching public rides');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handlePress = (rideId: number) => {
    // Navigate to RideDetailsScreen with the selected rideId
    navigation.navigate('RideDetails', { rideId: rideId.toString() });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/background-image-ride.jpg')} // Replace with your background image path
      style={styles.background}
    >
      <View style={styles.container}>
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handlePress(item.id)}
            >
              <Text style={styles.rideName}>{item.rideName}</Text>
              <Text style={styles.rideDetail}>{item.location}</Text>
              <Text style={styles.rideDetail}>{item.date}</Text>
              <Text style={styles.rideDetail}>{item.time}</Text>
              <Text style={styles.rideDetail}>Created by: {item.username}</Text>
            </TouchableOpacity>
          )}
        />
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
    padding: 16,
    backgroundColor: 'rgba(169, 169, 169, 0.6)', // Light grey background with opacity
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 25, // Rounded edges
    backgroundColor: '#95FA79', // Green background similar to login button
    borderColor: '#000000',
    borderWidth: 1,
  },
  rideName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black text color
  },
  rideDetail: {
    fontSize: 16,
    color: '#000000', // Black text color
  },
});

export default PublicRidesScreen;
