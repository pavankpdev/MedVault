import {router, useLocalSearchParams} from 'expo-router';
import * as React from 'react';
import {View} from 'react-native';
import {Button} from "react-native-paper";
import {useEffect, useState} from "react";
import {axios} from "../../config/axios";
import PDFViewer from "../../components/PDFViewer";
import Share from "../../components/Share";

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
            <View
                style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 10,
                }}
            >
                <Button
                    onPress={() => router.push("/(tabs)/dashboard")}
                >
                    Go Back
                </Button>
                <Share />
            </View>
            <PDFViewer hash={hash} />
        </View>
    );
}

