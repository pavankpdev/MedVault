import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import {useAuth} from "../../context/User";
import Thumbnail from "../../components/Thumbnail";
import {Link, router} from "expo-router";
import {Button} from "react-native-paper";

export default function Dashboard() {

  const addReport = () => {
    router.push("/(tabs)/add-report")
  }

  return (
    <View style={styles.container}>
      <Button
          style={styles.reportBtn}
          mode={'contained'}
          textColor={'#fff'}
          onPress={() => addReport()}
      >
        Add new Report
      </Button>
      <Thumbnail
          title={"asfasf asf asf "}
          hospital={'asf asf asf as f'}
          doctor={'asf asf'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor:"#EDF2F7",
    padding: 10,
    position: 'relative',
    height: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  reportBtn: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    zIndex: 100
  }
});
