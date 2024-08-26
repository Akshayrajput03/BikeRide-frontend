import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/axiosConfig';

// Define TypeScript interfaces for the ride data
interface RideEvent {
  id: number;
  rideName: string;
  location: string;
  date: string;
  time: string;
  username: string;
}

interface PrivateRidesScreenProps {
  route: {
    params: {
      id: string;
      username: string;
    };
  };
}

const PrivateRidesScreen: React.FC<PrivateRidesScreenProps> = ({ route }) => {
  const { id } = route?.params || {}; // Extract id from route params

  const [rides, setRides] = useState<RideEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        // Make a POST request to fetch the private rides for the user
        const response = await api.post('/ride/privateRide', { userId: id });
        setRides(response.data.data); // Assuming data is inside 'data' object in the response
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.rideName}>{item.rideName}</Text>
            <Text>{item.location}</Text>
            <Text>{item.date}</Text>
            <Text>{item.time}</Text>
            <Text>Created by: {item.username}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rideName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PrivateRidesScreen;
