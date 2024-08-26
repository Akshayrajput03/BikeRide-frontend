// src/screens/PublicRidesScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/axiosConfig'; // Import the Axios instance

interface PublicRidesScreenProps {
  id: string;
  username: string;
}

const PublicRidesScreen: React.FC = () => {

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get('/ride/publicRide'); // Fetch public rides
        setRides(response.data.data); // Assuming data is inside 'data' object in the response
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

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

export default PublicRidesScreen;
