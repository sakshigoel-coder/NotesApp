import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'Notes.db'});

const Addnote = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // db.transaction(tx => {
    //   tx.executeSql('DROP TABLE IF EXISTS Notes');
    // });

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, lastUpdated TEXT)',
        [],
        (tx, results) => {
          console.log('Table created successfully');
        },
        error => {
          console.log('Error creating table: ', error);
        },
      );
    });
  }, []);

  //   PushNotification.configure({
  //     onNotification: function (notification) {
  //       console.log('NOTIFICATION:', notification);
  //     },
  //     requestPermissions: true,
  //   });

  const addNote = () => {
    if (!title || !content) {
      alert('Please enter both title and content');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Notes (title, content, lastUpdated) VALUES (?, ?, ?)',
        [title, content, new Date().toLocaleTimeString()],
        (tx, results) => {
          console.log('Note added successfully');
          setTitle('');
          setContent('');
          navigation.navigate('Notes');
        },
        error => {
          console.log('Error adding note: ', error);
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline={true}
        numberOfLines={10}
      />
      <TouchableOpacity style={styles.saveButton} onPress={addNote}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  contentInput: {
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Addnote;
