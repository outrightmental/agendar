/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

// vendor
import React from "react";
import {useDispatch, useSelector} from "react-redux";
// app
import {
    doGameLoss,
    doGameNew,
    doGameQuit,
    doGameStart,
    doGameVictory,
    doPlayerUpdate,
    selectGameStatus,
    selectPlayerName,
    STATUS_DEFEAT,
    STATUS_LOBBY,
    STATUS_PLAYING,
    STATUS_VICTORY
} from "../engine/GameEngine";
import BoardView from "./BoardView";
import {Button, StyleSheet, Text, View} from "react-native";

/**
 GameView component
 <p>
 @return {*}
 */
export default function GameView(/*props*/) {
    const
        dispatch = useDispatch(),
        gameStatusSelector = selectGameStatus(),
        gameStatus = useSelector(state => gameStatusSelector(state));

    const
        playerOneNameSelector = selectPlayerName(0),
        playerOneName = useSelector(state => playerOneNameSelector(state));

    const
        newGame = () => dispatch(doGameNew()),
        startGame = () => dispatch(doGameStart()),
        winGame = () => dispatch(doGameVictory()),
        loseGame = () => dispatch(doGameLoss()),
        quitGame = () => dispatch(doGameQuit()),
        editPlayerOneName = () => dispatch(doPlayerUpdate(0, {
            name: prompt(`Enter new name for ${playerOneName}`)
        }));


    // state machine
    switch (gameStatus) {

        //
        default:
        case STATUS_LOBBY:
            return (
                <View style={styles.container}>
                    <Text style={styles.h1}>Star Harvester</Text>
                    <Text style={styles.h2}>The Way to Centauri</Text>
                    <Text style={styles.p}>Ready, {playerOneName}?</Text>
                    <Button
                        onPress={editPlayerOneName}
                        title="Change Name"
                    />
                    <Button
                        onPress={startGame}
                        title="Start"
                    />
                </View>
            );

        //
        case STATUS_PLAYING:
            return (
                <View style={styles.container}>
                    <BoardView/>
                    <View>
                        <Button
                            onPress={winGame}
                            title="Win"
                        />
                        <Button
                            onPress={loseGame}
                            title="Lose"
                        />
                        <Button
                            onPress={quitGame}
                            title="Quit"
                        />
                    </View>
                </View>
            );

        //
        case STATUS_VICTORY:
            return (
                <View style={styles.container}>
                    <Text style={styles.h1}>Victory!</Text>
                    <Button
                        onPress={newGame}
                        title="New Game"
                    />
                </View>
            );

        //
        case STATUS_DEFEAT:
            return (
                <View style={styles.container}>
                    <Text style={styles.h1}>Defeat!</Text>
                    <Button
                        onPress={newGame}
                        title="New Game"/>
                </View>
            );

    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    p: {
        fontSize: 20,
        fontWeight: "900",
        color: '#fff',
    },
    h1: {
        fontSize: 40,
        color: '#fff',
    },
    h2: {
        fontSize: 30,
        color: '#fff',
    }
});
