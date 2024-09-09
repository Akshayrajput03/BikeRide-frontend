import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import api from '../api/axiosConfig';
import { useNavigation } from '@react-navigation/native';

interface User {
  id: number | null;
  name: string | null;
  username?: string;
}

interface RideDetails {
  rideId: string;
  rideType: string;
  rideName: string;
  userId: string;
  username: string;
  location: string | null;
  time: string | null;
  date: string | null;
  mobileNumber: string | null;
  itenary: string | null;
  user: User[];
}

interface RideDetailsScreenProps {
  route: {
    params: {
      rideId: string;
    };
  };
}

const RideDetailsScreen: React.FC<RideDetailsScreenProps> = ({ route }) => {
  const { rideId } = route.params;
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [itenaryVisible, setItenaryVisible] = useState(false);
  const [editItenary, setEditItenary] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [removeUserModalVisible, setRemoveUserModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserMobileNumber, setNewUserMobileNumber] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const [newItenary, setNewItenary] = useState<string>('');

  const navigation = useNavigation();

  const fetchRideDetails = async () => {
    try {
      const response = await api.post('/ride/viewRide', { rideId: rideId });
      const responseData: RideDetails = response.data.data;
      setRideDetails(responseData);
      setUserList(responseData.user);
      setNewItenary(responseData.itenary || '');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching ride details');
      console.error('Error fetching ride details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideDetails();
  }, [rideId]);

  const handleAddUser = async () => {
    try {
      const response = await api.post('/ride/addUser', { rideId: rideId, rideAddUserName: newUserName, mobileNumber: newUserMobileNumber });
      if (response.status === 200 && response.data.resCode === '2000') {
        Alert.alert('Success', 'User added successfully');
        setAddUserModalVisible(false);
        await fetchRideDetails();
      } else if (response.data.errorDesc) {
        // Show the specific error message received from the server
        Alert.alert('Add user Failed', response.data.errorDesc);
      }else {
        Alert.alert('Error', 'Failed to add user');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the user');
      console.error('Error adding user:', error.response || error.message || error);
    }
  };

  const handleRemoveUser = async (username: string) => {
    try {
      const response = await api.post('/ride/removeUser', { rideId: rideId, rideAddUserName: username });
      if (response.status === 200 && response.data.resCode === '2000') {
        Alert.alert('Success', 'User removed successfully');
        setModalVisible(false);
        await fetchRideDetails();
      } else if (response.data.errorDesc) {
        // Show the specific error message received from the server
        Alert.alert('Remove user Failed', response.data.errorDesc);
      }else {
        Alert.alert('Error', 'Failed to remove user');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while removing the user');
      console.error('Error removing user:', error.response || error.message || error);
    }
  };

  const handleDeleteRide = async () => {
    try {
      const response = await api.post('/ride/deleteRide', { rideId: rideId});
      if (response.status === 200) {
        Alert.alert('Success', 'Ride deleted successfully');
        setModalVisible(false);
        await fetchRideDetails();
      } else {
        Alert.alert('Error', 'Failed to delete ride');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the ride');
      console.error('Error deleting ride:', error.response || error.message || error);
    }
  };

  const handleEditItenary = async () => {
    try {
      const response = await api.post('/ride/updateRide', { rideId: rideId, itenary: newItenary });
      if (response.status === 200) {
        Alert.alert('Success', 'Itenary updated successfully');
        setEditItenary(false);
        setItenaryVisible(false);
        await fetchRideDetails();
      } else {
        Alert.alert('Error', 'Failed to update itenary');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the itenary');
      console.error('Error updating itenary:', error.response || error.message || error);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name || item.username}</Text>
      <TouchableOpacity onPress={() => handleRemoveUser(item.username || '')}>
        <Text style={styles.removeUserText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (!rideDetails) {
    return <Text>No details available</Text>;
  }

  return (
    <ImageBackground
      source={require('../assets/background-image-ride.jpg')}
      style={styles.background}
    >
      <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={10}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{rideDetails.rideName}</Text>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{rideDetails.location ?? 'Not available'}</Text>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{rideDetails.date ?? 'Not available'}</Text>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>{rideDetails.time ?? 'Not available'}</Text>
          <Text style={styles.detailLabel}>Created by:</Text>
          <Text style={styles.detailValue}>{rideDetails.username}</Text>
          <Text style={styles.detailLabel}>Ride Type:</Text>
          <Text style={styles.detailValue}>{rideDetails.rideType}</Text>
          <Text style={styles.detailLabel}>Mobile Number:</Text>
          <Text style={styles.detailValue}>{rideDetails.mobileNumber ?? 'Not available'}</Text>

          <TouchableOpacity
            style={styles.itenaryButton}
            onPress={() => setItenaryVisible(!itenaryVisible)}
          >
            <Text style={styles.buttonText}>{itenaryVisible ? 'Hide Itenary' : 'Show Itenary'}</Text>
          </TouchableOpacity>

          {itenaryVisible && (
            <View style={styles.itenaryContainer}>
              <ScrollView style={styles.itenaryContent}>
                <Text style={styles.itenaryText}>{rideDetails.itenary}</Text>
              </ScrollView>
              {editItenary ? (
                <View>
                  <TextInput
                    style={styles.input}
                    value={newItenary}
                    onChangeText={setNewItenary}
                  />
                  <TouchableOpacity style={styles.addButton} onPress={handleEditItenary}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setEditItenary(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.editButton} onPress={() => setEditItenary(true)}>
                  <Text style={styles.buttonText}>Edit Itenary</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.usersButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Users</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={() => setAddUserModalVisible(true)}>
                <Text style={styles.buttonText}>Add User</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setRemoveUserModalVisible(true)}>
                <Text style={styles.buttonText}>Remove User</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRide}>
              <Text style={styles.buttonText}>Delete Ride</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={userList}
                renderItem={renderUser}
                keyExtractor={(item) => item.id?.toString() || ''}
              />
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={addUserModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter username to add"
                value={newUserName}
                onChangeText={setNewUserName}
              />
              <TextInput
                  style={styles.input}
                  placeholder="Enter mobile number"
                  value={newUserMobileNumber}
                  onChangeText={setNewUserMobileNumber}
                />
              <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
                <Text style={styles.buttonText}>Add User</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setAddUserModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={removeUserModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Are you sure you want to remove this user?</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleRemoveUser(userList[0]?.username || '')} // Example user removal
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setRemoveUserModalVisible(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  itenaryButton: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  itenaryContainer: {
    marginVertical: 10,
  },
  itenaryContent: {
    marginBottom: 10,
  },
  itenaryText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#3FFFAA',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  usersButton: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  closeModalButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 16,
    color: '#000',
  },
  removeUserText: {
    color: '#f44336',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RideDetailsScreen;
