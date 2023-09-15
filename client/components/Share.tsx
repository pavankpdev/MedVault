import "@ethersproject/shims"
import * as React from 'react';
import {Modal, Portal, Text, Button, PaperProvider, Avatar, TextInput} from 'react-native-paper';
import {router, useLocalSearchParams} from "expo-router";
import {ScrollView, StyleSheet, View} from "react-native";
import {useAuth} from "../context/User";
import {useEffect, useState} from "react";
import {getRecordContract, getVaultContract} from "../utils/provider";
import {axios} from "../config/axios";
import {useSecureStorage} from "../hooks/useSecureStorage";
import RecordJSON from "../ABI/Record.json";

const MyComponent = () => {
    const [visible, setVisible] = React.useState(false);
    const [allowedDoctors, setAllowedDoctors] = useState<any[]>([])
    const [recordAddress, setRecordAddress] = React.useState("");
    const [doctorWallet, setDoctorWallet] = React.useState("");
    const [doctorID, setDoctorID] = React.useState("");
    const [recordID, setRecordID] = React.useState("");

    const { hash: encryptedHash } = useLocalSearchParams();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    };

    const {user} = useAuth()

    const {getItem} = useSecureStorage()

    useEffect(() => {
        if(!user) return
        const vault = getVaultContract()
        vault.getRecordsByPatientId(user.id)
            .then(async (records: any[]) => {
                if(records[0][1].includes('0x0000000000')) {
                    return
                }

                const record = records.find((r) => r[4] === encryptedHash)
                if(record) {
                    setRecordAddress(record[1])
                    setRecordID(record[0].toString())
                    const {data} = await axios.get(`record/get-allowed-doctors/${record[0].toString()}`)
                    if(data?.data?.length > 0) {
                        setAllowedDoctors(data?.data)
                    }
                }
            })
    }, [user]);

    const shareReport = async () => {
        const stringyfiedWallet = await getItem("wallet")

        const wallet = JSON.parse(stringyfiedWallet)

        axios({
            method: "POST",
            url: `/transaction/write`,
            data: {
                userId: user?.id,
                method: 'setDoctorAccess',
                abi: RecordJSON.abi,
                params: [doctorWallet, true],
                password: wallet?.password,
                address: recordAddress
            }
        }).then(async ({data}) => {
            await axios({
                method: "POST",
                url: `/record/access`,
                data: {
                    doctorId: doctorID,
                    recordId: recordID
                }
            })
            setDoctorID("")
            setDoctorWallet("")
            hideModal()
        })

    }

    const revokeAccess = async (doctorId: string) => {
        const stringyfiedWallet = await getItem("wallet")

        const wallet = JSON.parse(stringyfiedWallet)

        const d = allowedDoctors.find((d) => d.doctor.id === doctorId)

        axios({
            method: "POST",
            url: `/transaction/write`,
            data: {
                userId: user?.id,
                method: 'setDoctorAccess',
                abi: RecordJSON.abi,
                params: [d.doctor.address, false],
                password: wallet?.password,
                address: recordAddress
            }
        }).then(async ({data}) => {
            await axios({
                method: "POST",
                url: `/record/access?revoke=true`,
                data: {
                    doctorId: doctorId,
                    recordId: recordID
                }
            })
            setDoctorID("")
            setDoctorWallet("")
            hideModal()
        })
    }

    return (
            <>
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                    >
                        <Text style={styles.title}>
                            Share your Report
                        </Text>
                        <ScrollView
                            style={{
                                paddingVertical: 20,
                                width: '100%',
                                backgroundColor: 'transparent',
                                gap: 10,
                                flexDirection: 'column',
                                height: 200
                            }}
                        >
                            {
                                allowedDoctors.map((report, index) => {
                                    return (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: 'column',
                                                        gap: 10,
                                                    }}
                                                >
                                                    <Avatar.Text size={30} label={
                                                        report?.doctor?.name.split(" ").length > 1 ?
                                                            `${report?.doctor?.name.split(" ")[1][0]}${report?.doctor?.name.split(" ")[2][0]}`
                                                            : `${report?.doctor?.name.split(" ")[1][0]}${report?.doctor?.name.split(" ")[1][1]}`} />
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Text style={{fontWeight: '800', color: '#000'}}>
                                                        {report?.doctor?.name}
                                                    </Text>
                                                    <Text style={{fontWeight: '400', color: '#000'}}>
                                                        {report?.doctor?.hospital}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Button
                                                textColor={'red'}
                                                onPress={() => revokeAccess(report?.doctor?.id)}
                                            >
                                                Revoke
                                            </Button>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                        <View
                            style={{
                                alignItems: 'center',
                                gap: 15
                            }}
                        >
                            <TextInput
                                label="Doctor's Wallet Address"
                                value={doctorWallet}
                                onChangeText={text => setDoctorWallet(text)}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                label="Doctor's Id"
                                value={doctorID}
                                onChangeText={text => setDoctorID(text)}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Button
                                mode={'contained'}
                                textColor={'#fff'}
                                onPress={shareReport}
                            >
                                Share
                            </Button>
                        </View>

                    </Modal>
                </Portal>
                <View>
                    <Button
                        mode={'contained'}
                        onPress={showModal}
                        textColor={'#fff'}
                    >
                        Share
                    </Button>
                </View>
            </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        width: "100%",
    },
});

export default MyComponent;