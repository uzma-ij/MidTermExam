// App.js
import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

const Stack = createStackNavigator();

const API_URL = 'https://dev.iqrakitab.net/api/books';

// Custom Hook for fetching data
const useGetData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        console.log("Response data:", response.data); // Log response data
        
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, [url]);

  return { data, loading, error };
};

// Custom Hook for searching data
const useSearchData = (data, searchQuery) => {
  const [filteredData, setFilteredData] = useState(data);

  React.useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchQuery]);

  return filteredData;
};

// Custom Hook for toggling RTL
const useToggleRTL = (initialValue = false) => {
  const [isRTL, setIsRTL] = useState(initialValue);

  const toggleRTL = () => {
    setIsRTL((prevValue) => !prevValue);
  };

  return { isRTL, toggleRTL };
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  const { data: books, loading, error } = useGetData(API_URL);
  const { isRTL, toggleRTL } = useToggleRTL(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useSearchData(books, searchQuery);

  const handleSearch = () => {
    // Search functionality is already handled by the custom hook
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Book Reading App!</Text>
      <Button title="Toggle RTL" onPress={toggleRTL} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by book name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <Text>{item.title}</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default App;