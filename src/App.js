/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

// vendor
import React from 'react'
import {Provider} from "react-redux";
// app
import store from "./engine";
import GameView from "./view/GameView";
import {StatusBar, Text, View, StyleSheet} from "react-native";

export default function App() {
    return (
        <Provider store={store}>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <GameView/>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
