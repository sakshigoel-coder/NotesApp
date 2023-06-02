import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import EditNote from './src/screens/EditNote';
import Addnote from './src/screens/Addnote';
import HomeScreen from './src/screens/HomeScreen';
import NoteList from './src/screens/NoteList';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Notes'}}
        />

        <Stack.Screen name="AddNote" component={Addnote} />

        <Stack.Screen
          name="EditNote"
          component={EditNote}
          options={{title: 'Notes'}}
        />
        <Stack.Screen
          name="Notes"
          component={NoteList}
          options={{title: 'List'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
