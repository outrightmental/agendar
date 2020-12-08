/*
 * Copyright (c) Outright Mental (https://outrightmental.com/) All Rights Reserved.
 */

// vendor
import React from "react";
// app
import {selectDaysElapsed, selectPlayerData} from "../../engine/BoardEngine";
import {useSelector} from "react-redux";
import {StyleSheet, Text, View} from "react-native";

/**
 BoardHeader component renders the game information governing all players
 <p>
 @return {*}
 */
export default function BoardHeader() {

    const
        daysElapsedSelector = selectDaysElapsed(),
        daysElapsed = useSelector(state => daysElapsedSelector(state));

    const
        playerData = selectPlayerData();

    return (
        <View>
            <Text style={styles.text}>Name: {playerData.name}</Text>
            <Text style={styles.text}>{daysElapsed} Days Elapsed</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
        fontWeight: 900,
        color: '#fff',
    },
});
