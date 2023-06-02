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

const EditNote = ({navigation, route}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Notes WHERE id = ?',
        [route.params.noteId],
        (tx, results) => {
          const {title, content} = results.rows.item(0);
          setTitle(title);
          setContent(content);
        },
      );
    });
  }, [route.params.noteId]);

  const handleSaveNote = () => {
    const lastUpdated = new Date().toLocaleTimeString(lastUpdated);
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Notes SET title = ?, content = ?, lastUpdated = ? WHERE id = ?',
        [title, content, lastUpdated, route.params.noteId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            navigation.navigate('Notes');
          }
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline={true}
        textAlignVertical="top"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 20,
  },
  contentInput: {
    height: 200,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditNote;
