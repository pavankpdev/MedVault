import {Dimensions, StyleSheet} from "react-native";
import {WebView} from "react-native-webview";
import * as React from "react";

type PDFViewerProps = {
    hash: string
}
const PDFViewer: React.FC<PDFViewerProps> = (props) => {
    return <>
        <WebView
            style={styles.container}
            source={{ uri: `https://docs.google.com/gview?embedded=true&url=${props.hash}` }}
        />
    </>
}

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        width: deviceWidth,
        height: deviceHeight
    },
});

export default PDFViewer