import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Share,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'Notes.db'});

const HomeScreen = ({navigation}) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, lastUpdated TEXT)',
      );
    });

    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });

    return unsubscribe;
  }, [navigation]);

  const loadNotes = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Notes', [], (tx, results) => {
        setNotes(results.rows.raw());
      });
    });
  };

  const renderItem = ({item}) => {
    const shareNote = () => {
      Share.share({
        message: `Check out my note: ${item.title}\n\n${item.content}`,
      })
        .then(result => {
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              console.log(
                'Note shared with activity type:',
                result.activityType,
              );
              // Shared with an activity type
            } else {
              // setShared(true);
              // Shared
              console.log('Note shared successfully');
            }
          } else if (result.action === Share.dismissedAction) {
            // Dismissed
            console.log('Share dismissed');
          }
        })
        .catch(error => console.log('Error sharing note:', error.message));
    };
    return (
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => navigation.navigate('EditNote', {noteId: item.id})}>
        <View
          style={{
          
            backgroundColor: 'whte',
            width: '95%',
            height: 100,
            borderRadius: 10,
            margin: 10,
          
          }}>
          <Text style={styles.noteTitle}>
            <Text style={{fontWeight: 'bold'}}>Title</Text>: {item.title}
          </Text>
          <Text style={styles.noteContent}>
            <Text style={{fontWeight: 'bold'}}>Content</Text>: {item.content}
          </Text>
          <Text style={styles.noteLastUpdated}>
            <Text style={{fontWeight: 'bold'}}>Last Updated</Text>:{' '}
            {item.lastUpdated}
          </Text>

          <TouchableOpacity style={styles.shareButton} onPress={shareNote}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.notesList}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNote')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    padding: 26,
  },
  noteList: {
    flex: 1,
    paddingLeft: 20,
  },
  noteTitle: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  noteContent: {
    paddingLeft: 10,
  },
  noteLastUpdated: {
    paddingLeft: 10,
  },
  note: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    paddingBottom: 10,
    flexDirection: 'row',
  },
  listItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    padding: 20,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#e91e63',
  },
  textInput: {
    alignSelf: 'stretch',
    color: '#fff',
    padding: 20,
    backgroundColor: '#252525',
    borderTopWidth: 2,
    borderTopColor: '#ededed',
  },
  addButton: {
    position: 'absolute',
    zIndex: 11,
    right: 20,
    bottom: 50,
    backgroundColor: '#e91e63',
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    padding: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  deleteButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    padding: 6,
    top: 12,
    bottom: 12,
    right: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noteTimestamp: {
    // position: 'absolute',
    top: 10,
    right: 10,
    color: '#A9A9A9',
    fontStyle: 'italic',
    fontSize: 12,
  },
  noteTimestampContainer: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    marginTop: 4,
  },
  notesList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  shareButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,

    marginTop: 12,
    width: 90,
    alignSelf: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  noteItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    padding: 16,
    elevation: 2,
    width: '94%',
    height: 170,
    borderWidth:1
  },
});
export default HomeScreen;

// import React, {useState, useEffect} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({name: 'Notes.db', location: 'default'});

// export default function HomeScreen() {
//   const [noteText, setNoteText] = useState('');
//   const [notes, setNotes] = useState([]);

//   useEffect(() => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'CREATE TABLE IF NOT EXISTS Notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteText TEXT, lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP);',
//         [],
//         (tx, results) => {
//           console.log('Notes table created successfully');
//         },
//         error => {
//           console.log('Error creating Notes table: ', error);
//         },
//       );
//     });
//     fetchNotes();
//   }, []);

//   const addNote = () => {
//     if (noteText !== '') {
//       const currentTimestamp = new Date().toISOString();
//       db.transaction(tx => {
//         tx.executeSql(
//           'INSERT INTO Notes (noteText) VALUES (?)',
//           [noteText],
//           (tx, results) => {
//             if (results.rowsAffected > 0) {
//               setNotes([
//                 ...notes,
//                 {id: results.insertId, noteText, lastUpdated: currentTimestamp},
//               ]);
//               setNoteText('');
//             }
//           },
//           error => {
//             console.log('Error adding note: ', error);
//           },
//         );
//       });
//     }
//   };

//   const updateNote = (id, text) => {
//     const currentTimestamp = new Date().toISOString();
//     db.transaction(tx => {
//       tx.executeSql(
//         'UPDATE Notes SET noteText = ?, lastUpdated = ? WHERE id = ?',
//         [text, currentTimestamp, id],
//         (tx, results) => {
//           if (results.rowsAffected > 0) {
//             setNotes(
//               notes.map(note =>
//                 note.id === id
//                   ? {id, noteText: text, lastUpdated: currentTimestamp}
//                   : note,
//               ),
//             );
//           }
//         },
//       );
//     });
//   };

//   const deleteNote = id => {
//     db.transaction(tx => {
//       tx.executeSql('DELETE FROM Notes WHERE id = ?', [id], (tx, results) => {
//         if (results.rowsAffected > 0) {
//           setNotes(notes.filter(note => note.id !== id));
//         }
//       });
//     });
//   };

//   const fetchNotes = () => {
//     db.transaction(tx => {
//       tx.executeSql('SELECT * FROM Notes', [], (tx, results) => {
//         let notes = [];
//         for (let i = 0; i < results.rows.length; i++) {
//           notes.push(results.rows.item(i));
//         }
//         setNotes(notes);
//       });
//     });
//   };

//   const renderItem = ({item}) => (
//     <View style={styles.note}>
//       <TextInput
//         style={styles.noteText}
//         value={item.noteText}
//         onChangeText={text => updateNote(item.id, text)}
//         placeholder="Type your note here..."
//         multiline={true}
//         placeholderTextColor="#A9A9A9"
//       />
//       <View style={styles.noteTimestampContainer}>
//         <Text style={styles.noteTimestamp}>
//           Last Updated: {item.lastUpdated}
//         </Text>
//       </View>
//       <TouchableOpacity
//         onPress={() => deleteNote(item.id)}
//         style={styles.deleteButton}>
//         <Text style={styles.deleteButtonText}>X</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Notes</Text>
//       </View>
//       <FlatList
//         style={styles.noteList}
//         data={notes}
//         renderItem={renderItem}
//         keyExtractor={item => item.id.toString()}
//       />
//       <View style={styles.footer}>
//         <TextInput
//           style={styles.textInput}
//           value={noteText}
//           onChangeText={text => setNoteText(text)}
//           placeholder="Type your note here..."
//           multiline={true}
//           placeholderTextColor="#A9A9A9"
//         />
//         <TouchableOpacity onPress={addNote} style={styles.addButton}>
//           <Text style={styles.addButtonText}>Add</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
