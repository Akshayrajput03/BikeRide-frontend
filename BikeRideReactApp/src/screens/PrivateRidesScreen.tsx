import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Alert
} from 'react-native';
import api from '../api/axiosConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

interface RideEvent {
  id: number;
  rideName: string;
  location: string;
  date: string;
  time: string;
  username: string;
}

interface PrivateRidesScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PrivateRides'>;
  route: {
    params: {
      id: string;
      username: string;
    };
  };
}

const PrivateRidesScreen: React.FC<PrivateRidesScreenProps> = ({ route, navigation }) => {
  const { id } = route?.params || {};
  console.log('id', id);
  const [rides, setRides] = useState<RideEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.post('/ride/privateRide', { userId: id });
        setRides(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [id]);

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
      source={require('../assets/background-image-ride.jpg')}
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
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(169, 169, 169, 0.6)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 25,
    backgroundColor: '#95FA79',
    borderColor: '#000000',
    borderWidth: 1,
  },
  rideName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  rideDetail: {
    fontSize: 16,
    color: '#000000',
  },
});

export default PrivateRidesScreen;
