import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import Task from './components/Task';
import firebase from 'firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FlashMessage from 'react-native-flash-message';
import {showMessage} from 'react-native-flash-message';

const firebaseConfig = {
  apiKey: 'AIzaSyA1Z9CJBPv51bJUz48QH84bmZBe6GNuEgk',
  authDomain: 'todo-list-61cab.firebaseapp.com',
  projectId: 'todo-list-61cab',
  storageBucket: 'todo-list-61cab.appspot.com',
  messagingSenderId: '191334875393',
  appId: '1:191334875393:web:9a9df32406e8163b3a9b00',
};
export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selctedItem, setselctedItem] = useState(null);
  const [editedItem, seteditedItem] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setselectedDate] = useState('');

  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    getTasks();
  }, []);

  const handleAddTask = () => {
    Keyboard.dismiss();
    addTask();
    setTask('');
  };

  const handleEditTask = () => {
    Keyboard.dismiss();
    editTask();
  };

  const completeTask = async index => {
    await firebase
      .database()
      .ref('Tasks/' + index)
      .remove();
    showMessage({
      message: 'Success!',
      description: 'Task completed successfully!',
      type: 'info',
    });
  };

  const addTask = async () => {
    if (selectedDate == '') {
      showMessage({
        message: 'Warning!',
        description: 'Select date please!',
        type: 'error',
      });
      return;
    }
    const date = selectedDate.toString().split('(');
    await firebase.database().ref('Tasks/').push({
      task,
      isCompleted: false,
      date: date[0],
    });
    showMessage({
      message: 'Success!',
      description: 'Task added successfully!',
      type: 'info',
    });
  };

  const editTask = async () => {
    await firebase
      .database()
      .ref('Tasks/' + selctedItem.key)
      .update({
        task: editedItem,
        date: selectedDate.toString(),
      });
    setModalVisible(!modalVisible);
    showMessage({
      message: 'Success!',
      description: 'Task edit successfully!',
      type: 'info',
    });
  };

  const getTasks = async () => {
    firebase
      .database()
      .ref('Tasks')
      .on('value', snapshot => {
        let tasks = [];
        snapshot.forEach(task => {
          tasks.push(task);
        });
        setTaskItems([]);
        setTaskItems(tasks);
      });
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    setselectedDate(date);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
        {/* Today's Tasks */}
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <View style={styles.items}>
            {taskItems.map((item, index) => {
              return (
                <View key={index}>
                  <Task
                    text={item}
                    onEditClick={() => {
                      setModalVisible(!modalVisible);
                      setselctedItem(item);
                      seteditedItem(item.val().task);
                      setselectedDate(item.val().date);
                    }}
                    onPressComplete={() => completeTask(item.key)}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>Pick Date</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAddTask()}
          disabled={task == '' || selectedDate == ''}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{width: '100%', flexDirection: 'row'}}>
              <TextInput
                style={styles.input}
                placeholder={'Write a task'}
                value={editedItem}
                onChangeText={text => seteditedItem(text)}
              />
              <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                <View style={styles.addWrapper}>
                  <Text style={{fontSize: 5}}>{selectedDate.toString()}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleEditTask}>
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <FlashMessage position="top" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 10,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginRight: 5,
  },
  addText: {
    textAlign: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 10,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
