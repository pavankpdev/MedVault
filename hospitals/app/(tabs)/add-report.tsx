import { StyleSheet } from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import { Text, View } from '../../components/Themed';
import { Button } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import React from "react";
import FormData from 'form-data';

import {useAuth} from "../../context/User";
import {axios} from "../../config/axios";
import {router} from "expo-router";

export default function TabOneScreen() {
    const [name, setName] = React.useState("");
    const [patientId, setPatientId] = React.useState("");
    const [diagnosis, setDiagnosis] = React.useState("");

    const {user, setIsAuthenticated} = useAuth()

    const submit = async () => {
        const document = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

        if (!document) return;

        const formData = new FormData();

        const payload = {
            diagnosis,
            doctorId: user?.id,
            doctorName: user?.name,
            hospitalName: user?.hospital
        }

        formData.append('name', name);
        formData.append('patientId', patientId);
        formData.append('metadata', JSON.stringify(payload));
        formData.append('file', { uri: (document as {assets: Array<{uri: string}>})?.assets[0].uri, name, type: 'application/pdf' });

        const response = await axios.post('/record/new', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

       alert("Report uploaded successfully")

        setName("")
        setPatientId("")
        setDiagnosis("")

       router.push("/(tabs)/dashboard")
        return
    }

    return (
        <View style={styles.container}>
            <TextInput
                label="Report Name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                label="Patient patientId address"
                value={patientId}
                onChangeText={text => setPatientId(text)}
                style={styles.input}
            />
            <TextInput
                label="Diagnosed for"
                value={diagnosis}
                onChangeText={text => setDiagnosis(text)}
                style={styles.input}
            />
            <Button
                icon="arrow-right"
                mode="contained"
                style={{
                    marginVertical: 15,
                }}
                textColor="#fff"
                onPress={submit}
            >
                Upload PDF
            </Button>

            <Button
                icon="arrow-right"
                mode="contained"
                style={{
                    marginVertical: 15,
                }}
                textColor="#fff"
                onPress={submit}
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
