import {ScrollView, StyleSheet} from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import {useAuth} from "../../context/User";
import Thumbnail from "../../components/Thumbnail";
import {useEffect, useState} from "react";
import {getVaultContract} from "../../utils/provider";
import {ethers} from "ethers";

type IRecords = {
  id: string,
  recordAddress: string,
  metadata:string,
  name: string,
  ipfs: string,
  patientUid: string,
}
export default function TabTwoScreen() {
  const [records, setRecords] = useState<IRecords[]>([])

  const {user} = useAuth()

  useEffect(() => {
    if(!user) return
    const vault = getVaultContract()
    vault.getRecordsByPatientId('3a6d819c-e99a-4027-a70e-ad52718b7819')
        .then((records: any[]) => {
          if(records[0][1].includes('0x0000000000')) {
            return
          }
          let recordsCollection: IRecords[] = []
          for(const Record of records) {
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
  }, [user]);

  return (
      <View style={{
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#EDF2F7',
      }}>
        <ScrollView
            style={{
              paddingVertical: 20,
              width: '100%',
              backgroundColor: 'transparent',
              gap: 10,
              flexDirection: 'column',
            }}
        >
          <View style={styles.container}>
            {
              records.length === 0 ? (
                  <Text style={{fontWeight: '600', color: '#000'}}>
                    You have no records yet.
                  </Text>
              ) : records.map((record, index) => (
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
          </View>
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
    height: '100%',
    gap: 15
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
});
