import {Pressable, StyleSheet} from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import {useAuth} from "../../context/User";
import Thumbnail from "../../components/Thumbnail";
import {Link, router} from "expo-router";
import {Button} from "react-native-paper";
import {useEffect, useState} from "react";
import {axios} from "../../config/axios";
import {getVaultContract} from "../../utils/provider";
import {
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';


type IRecords = {
  id: string,
  recordAddress: string,
  metadata:string,
  name: string,
  ipfs: string,
  patientUid: string,
}

export default function Dashboard() {

  const [records, setRecords] = useState<IRecords[]>([])

  const {user} = useAuth()

  const addReport = () => {
    router.push("/(tabs)/add-report")
  }

  useEffect(() => {
    if(!user) {
      router.push("/login")
    }

    axios({
      method: "GET",
      url: `/record/access/${user?.id}`,
    }).then(async ({data}) => {
      const vaultContract = getVaultContract()
      let recordsCollection: IRecords[] = []
      for (const record of data?.data) {
        const Record = await vaultContract.getRecord(record?.address)

        recordsCollection.push({
          id: Record[0].toString(),
          recordAddress: Record[1],
          metadata:Record[2],
          name: Record[3],
          ipfs: Record[4],
          patientUid: Record[5].toString(),
        })
      }

      setRecords(recordsCollection)
    })
  }, []);

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
  };

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
      <View style={styles.profile}>
        <Text style={styles.text}>
          Doctor Name: <Text style={{fontWeight: '600', color: '#000'}}>{user?.name}</Text>
        </Text>
        <Text style={styles.text}>
          Doctor Id: <Pressable
          onPress={() => copyToClipboard(user?.id as string)}
        >
          <Text style={{fontWeight: '600', color: '#000'}}>{user?.id}</Text>
        </Pressable>
        </Text>
        <Text style={styles.text}>
          Wallet: <Pressable
            onPress={() => copyToClipboard(user?.wallet as string)}
        >
          <Text style={{fontWeight: '600', color: '#000'}}>{`${user?.wallet.slice(0,4)}...${user?.wallet.slice(-4)}`}</Text>
        </Pressable>
        </Text>
        <Text style={styles.text}>
          Hospital: <Text style={{fontWeight: '600', color: '#000'}}>{user?.hospital}</Text>
        </Text>
      </View>
      <View style={styles.separator} />
      <Text style={{fontWeight: '600', color: '#2563eb'}}>
        List of Reports you have access to
      </Text>

      <ScrollView
        style={{
          paddingVertical: 20,
          width: '100%',
          backgroundColor: 'transparent',
          gap: 10,
          flexDirection: 'column',
        }}
      >
        {
          records.map((record, index) => (
              <Thumbnail
                  title={record.name}
                  hospital={JSON.parse(record.metadata).hospitalName as string}
                  doctor={JSON.parse(record.metadata).doctorName as string}
                  diagnosis={JSON.parse(record.metadata).diagnosis as string}
                  hash={record.ipfs}
                  key={index}
              />
          ))
        }

      </ScrollView>

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
  profile: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    borderRadius: 10
  },
  text: {
    color: '#000'
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
