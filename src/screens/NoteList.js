import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import { PDFDocument, PDFPage } from 'pdf-lib';

const db = openDatabase({name: 'Notes.db'});

const NoteList = ({navigation}) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Notes',
        [],
        (tx, results) => {
          const rows = results.rows;
          const notes = [];
          for (let i = 0; i < rows.length; i++) {
            notes.push(rows.item(i));
          }
          setNotes(notes);
        },
        error => {
          console.log('Error fetching notes: ', error);
        },
      );
    });
  }, []);

  const handleDeleteNote = id => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM Notes WHERE id = ?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          const updatedNotes = notes.filter(note => note.id !== id);
          setNotes(updatedNotes);
        }
      });
    });
  };

  const handleDeleteAllNotes = () => {
    Alert.alert(
      'Delete all notes?',
      'Are you sure you want to delete all notes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql('DELETE FROM Notes', [], (tx, results) => {
                if (results.rowsAffected > 0) {
                  setNotes([]);
                }
              });
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleSaveToPDF = async () => {
    const documentsPath = RNFS.DocumentDirectoryPath;
    const pdfPath = `${documentsPath}/notes.pdf`;
  
    const pages = [];
    notes.forEach((note) => {
      const page = PDFPage.create().setMediaBox(200, 200).drawText(note.content, {
        x: 5,
        y: 5,
        color: '#000000',
        fontName: 'Helvetica-Bold',
        fontSize: 12,
      });
      pages.push(page);
    });
  
    try {
      const pdfDoc = await PDFDocument.create();
      for (const page of pages) {
        pdfDoc.addPage(page);
      }
      const pdfBytes = await pdfDoc.save();
  
      await RNFS.writeFile(pdfPath, pdfBytes, 'base64');
      Alert.alert('Success', 'PDF file saved successfully');
    } catch (error) {
      console.log('Error while saving PDF: ', error);
      Alert.alert('Error', 'Failed to save PDF file');
    }
  };

  const renderNoteItem = ({item}) => {
    const handleNotePress = () => {
      navigation.navigate('Home');
    };

    const handleDeletePress = () => {
      handleDeleteNote(item.id);
    };

    return (
      <TouchableOpacity
        onPress={handleNotePress}
        onLongPress={handleDeletePress}>
        <View style={styles.note}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
          {/* 
          <Text>
            Last Updated: {new Date(lastUpdated).toLocaleString()}{' '}
            {item.lastUpdated}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {notes.length === 0 ? (
        <Text>No notes found</Text>
      ) : (
        <>
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={item => item.id.toString()}
          />
          <View style={{flexDirection:'row',justifyContent:'space-between'
          }}>
          <View>
          <TouchableOpacity onPress={handleDeleteAllNotes}>
            <Text>Delete All Notes</Text>
          </TouchableOpacity>
          </View>
          <View>
          <TouchableOpacity onPress={handleSaveToPDF}>
            <Text>Save as PDF</Text>
          </TouchableOpacity>
         </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  note: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
  },
});

export default NoteList;
// const renderNoteItem = ({item}) => {
//   const {id, title, content, lastUpdated, remainder} = item;

//   const handleNotePress = () => {
//     // navigate to individual note screen passing in the id as a param
//   };

//   const handleDeletePress = () => {
//     handleDeleteNote(id);
//   };

//   return (
//     <TouchableOpacity onPress={handleNotePress} onLongPress={handleDeletePress}>
//       <View>
//         <Text>{title}</Text>
//         <Text>{content}</Text>
//         <Text>Last Updated: {new Date(lastUpdated).toLocaleString()}</Text>
//         {remainder && (
//           <Text>Remainder: {new Date(remainder).toLocaleString()}</Text>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// };
