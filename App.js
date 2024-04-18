import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position.coords);
      },
      (error) => {
        console.log("Location fetching error: ", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      Alert.alert("Success", "Login successful!");
    } else {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userInfo = await signInWithGoogle();
      Alert.alert("Success", `Signed in as ${userInfo.email}`);
      fetchNearbyHospitals();
    } catch (error) {
      Alert.alert("Error", "An error occurred during Google Sign-In");
    }
  };

  const signInWithGoogle = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userInfo = {
          email: "example@gmail.com",
          name: "John Doe",
        };
        resolve(userInfo);
      }, 1000);
    });
  };

  const fetchNearbyHospitals = async () => {
    if (!userLocation) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${userLocation.latitude},${userLocation.longitude}`,
            radius: 5000, 
            type: "hospital",
          },
        }
      );

      setNearbyHospitals(response.data.results);
    } catch (error) {
      console.log("Error fetching nearby hospitals: ", error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Login with Google" onPress={handleGoogleSignIn} />
      {loading && <Text>Loading...</Text>}
      {nearbyHospitals.length > 0 && (
        <ScrollView style={styles.hospitalList}>
          <Text>Nearby Hospitals:</Text>
          {nearbyHospitals.map((hospital) => (
            <Text key={hospital.place_id}>{hospital.name}</Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  hospitalList: {
    marginTop: 20,
  },
});

export default App;
