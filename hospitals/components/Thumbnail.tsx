import {View, Text, StyleSheet} from "react-native";
import React from "react";
import {Button, Chip} from 'react-native-paper';

type ThumbnailProps = {
    title: string,
    hospital: string,
    doctor: string,
    diagnosis: string,
    hash: string
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
    return <>
        <View style={styles.container}>
            <Text
                style={styles.title}
            >
                {props.title}
            </Text>
            <Text> <Chip icon="hospital-building" onPress={() => console.log('Pressed')} textStyle={{color: '#64748b'}}>{props.hospital}</Chip> </Text>
            <Text> <Chip icon="doctor" onPress={() => console.log('Pressed')} textStyle={{color: '#64748b'}}>{props.doctor}</Chip> </Text>
            <View style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row'
            }}>
                <Text> <Chip icon="file-document-multiple" onPress={() => console.log('Pressed')} textStyle={{color: '#64748b'}}>{props.diagnosis}</Chip> </Text>
                <Button mode={'outlined'}>
                    View Report
                </Button>
            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor:"#fff",
        padding: 10,
        paddingVertical: 20,
        textAlign: 'left',
        width: '100%',
        borderRadius: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        paddingHorizontal: 10,
        marginBottom: 10
    },

});

export default Thumbnail