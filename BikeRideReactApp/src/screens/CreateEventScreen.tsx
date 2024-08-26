import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/axiosConfig';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type CreateEventScreenRouteProp = RouteProp<RootStackParamList, 'CreateEvent'>;

const CreateEventScreen: React.FC = ({ navigation }) => {
  const route = useRoute<CreateEventScreenRouteProp>();
  const { id, username } = route.params || {}; // Extract id and username

  const [rideName, setRideName] = useState('');
  const [rideType, setRideType] = useState('PUBLIC');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState(''); 

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleCreateRide = async () => {
    const requestPayload = {
      rideName,
      rideType,
      location,
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().split(' ')[0],
      description,
      userId: id,
      username,
    };

    try {
      const response = await api.post('/ride/create', requestPayload);
      if (response.status === 200) {
        Alert.alert('Ride Created', 'Your ride has been created successfully.');
        navigation.navigate('Rides');
      } else {
        Alert.alert('Creation Failed', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Creation Failed', 'An error occurred while creating the ride.');
    }
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Bike Ride Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Ride Name"
        value={rideName}
        onChangeText={setRideName}
      />

      <Text style={styles.label}>Ride Type</Text>
      <Picker
        selectedValue={rideType}
        onValueChange={(itemValue) => setRideType(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Public" value="PUBLIC" />
        <Picker.Item label="Private" value="PRIVATE" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date.toISOString().split('T')[0]}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Time (HH:MM)"
          value={time.toTimeString().split(' ')[0].substring(0, 5)}
          editable={false}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Create Ride" onPress={handleCreateRide} />
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
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default CreateEventScreen;
