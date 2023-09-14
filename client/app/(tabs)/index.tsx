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

export default function TabOneScreen() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const login = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message)
            return
        }

        if (data.user) {
            router.replace("/(tabs)/dashboard" as any)
            return
        }

        router.replace("/(tabs)/register" as any)

    }

    return (
        <View style={styles.container}>
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
                onPress={login}
            >
                Login
            </Button>
            <Link href="/(tabs)/register" asChild>
                <Pressable>
                    <Text>Create new account</Text>
                </Pressable>
            </Link>
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
