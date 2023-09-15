import {View, Text, StyleSheet} from "react-native";
import React from "react";

type ThumbnailProps = {
    title: string,
    hospital: string,
    doctor: string,
    hash?: string
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
    return <>
        <View style={styles.container}>
            <Text
                style={styles.title}
            >
                {props.title}
            </Text>
            <Text> {props.hospital} </Text>
            <Text> {props.doctor} </Text>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor:"#EDF2F7",
        padding: 10,
        textAlign: 'left',
        width: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },

});

export default Thumbnail