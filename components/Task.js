import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Task = props => {
  const task = props.text.val();

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <View style={{flex: 1}}>
          <Text style={styles.itemText}>{task.task}</Text>
          <Text style={{...styles.itemText, fontSize: 10}}>{task.date}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.circular}
          onPress={props.onPressComplete}>
          <Text style={{fontSize: 10}}>✔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circular} onPress={props.onEditClick}>
          <Text style={{fontSize: 10}}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
  },
});

export default Task;
