import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { Button } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import React from "react";
import {supabase} from "../../Provider/supabase";
import { router } from 'expo-router';
import { Link } from "expo-router";
import { Pressable } from "react-native";
import {useSecureStorage} from "../../hooks/useSecureStorage";
import {useAuth} from "../../context/User";
import {axios} from "../../config/axios";

export default function TabOneScreen() {
    const [id, setId] = React.useState("");
    const [password, setPassword] = React.useState("");

    const {setUser, setIsAuthenticated} = useAuth()

    const login = async () => {

        const {data} = await axios({
            method: "POST",
            url: "/doctor/login",
            data: {
                id,
                password
            }
        })


        if(data?.status === "success") {
            if (setUser) {
                setUser({
                    id: data?.doctor?.id,
                    name: data?.doctor?.name,
                    hospital: data?.doctor?.hospital,
                });

                if (setIsAuthenticated) {
                    setIsAuthenticated(true)
                }
            }

            router.push("/(tabs)/dashboard")
        }

    }

    return (
        <View style={styles.container}>
            <TextInput
                label="Doctor ID"
                value={id}
                onChangeText={text => setId(text)}
                style={styles.input}
                autoCapitalize="none"
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
                style={{
                    marginVertical: 15,
                }}
                textColor="#fff"
                onPress={login}
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
