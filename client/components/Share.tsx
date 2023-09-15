import * as React from 'react';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
import {router} from "expo-router";
import {View} from "react-native";

const MyComponent = () => {
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    };

    return (
            <>
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                    >
                        <Text>
                            Share your Report
                        </Text>
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

export default MyComponent;