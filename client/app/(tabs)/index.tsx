import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { Button } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import React from "react";

export default function TabOneScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View style={styles.container}>
      <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
      />
      <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
      />
      <Button
          icon="arrow-right"
          mode="contained"
          onPress={() => console.log('Pressed')}
          style={{
            marginVertical: 15,
          }}
          textColor="#fff"
      >
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor:"#EDF2F7",
    padding: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {

    height: 1,
    width: '80%',
  },
});
