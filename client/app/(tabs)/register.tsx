import '@ethersproject/shims'
import { StyleSheet } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { Button } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import React from "react";
import {supabase} from "../../Provider/supabase";
import { router } from 'expo-router';
import {useSecureStorage} from "../../hooks/useSecureStorage";
import {axios} from "../../config/axios"
export default function TabOneScreen() {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");

    const {setItem} = useSecureStorage()

    const register = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        console.log(data.session)

        if (error) {
            alert(error.message)
            return
        }

        const res = await axios({
            method: "POST",
            url: "/account/new",
            headers: {
                'x-access-token': data.session?.access_token,
                'x-refresh-token': data.session?.refresh_token,
            },
            data: {
                password,
                name
            }
        }).catch(console.log)

        console.log(res)

        // await setItem("wallet", res?.encryptedWalletJSON)

        router.replace("/(tabs)/dashboard" as any)
        return
    }

    return (
        <View style={styles.container}>
            <TextInput
                label="Name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                keyboardType="email-address"
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
                onPress={register}
            >
                Register
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
