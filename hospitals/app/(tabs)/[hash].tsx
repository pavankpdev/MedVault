import {router, useLocalSearchParams} from 'expo-router';
import * as React from 'react';
import {View} from 'react-native';
import {Button} from "react-native-paper";
import {useEffect, useState} from "react";
import {axios} from "../../config/axios";
import PDFViewer from "../../components/PDFViewer";

export default function ReportViewer() {

    const [hash, setHash] = useState('');

    const { hash: encryptedHash } = useLocalSearchParams();

    useEffect(() => {
        axios({
            method: "GET",
            url: `/record/${encryptedHash}`,
        }).then(({data}) => {
            setHash(`https://ipfs.io/ipfs/${data?.ipfs}`)
        })
    }, [encryptedHash]);

    if(!hash) {
        return <></>
    }

    return (
        <View style={{
            width: '100%',
            height: '100%',
        }}>
            <Button
                onPress={() => router.push("/(tabs)/dashboard")}
            >
                Go Back
            </Button>
            <PDFViewer hash={hash} />
        </View>
    );
}

