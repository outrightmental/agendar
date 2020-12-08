/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

// app
import {produce} from "immer";
import {GAME_LOSS, GAME_NEW, GAME_QUIT, GAME_START, GAME_TICK, GAME_VICTORY} from "./GameEngine";
import {createSelector} from "reselect";
import {GAME_DAYS_PER_SECOND,} from "../constants";

// Setup the initial state
/**
 @typedef {*} BoardState
 */
const initialState = {
    fromMillisUTC: null,
    toMillisUTC: null,
    daysElapsed: 0,
    cycle: {
        payroll: {
            lastDay: 0,
            total: 0,
        },
        expense: {
            lastDay: 0,
            total: 0,
        },
        market: {
            lastDay: 0,
            total: 0,
        },
    },
    // Only one player for one
    // The BoardEngine contains the data for a single match to determine victory (reset between matches)
    player: {
        messages: [],
        resources: {
            salesValue: 0, // units
            marketShare: 0, // percent
            cash: 1000000, // dollars
        },
        personMap: {},
    }

};

/**
 * The Redux reducer of a board state to an updated board state
 * @param input to update
 * @param {{
 *     type:string,
 *     departmentType:string,
 *     departmentId:string,
 * }} action to reduce
 * @return {*} updated state
 */
export const boardReducer = function (input, action) {

    // use mutate the requested key+value
    switch (action.type) {

        case GAME_LOSS:
            return produce(input, state => {
                state.toMillisUTC = new Date().getTime();
            });

        case GAME_NEW:
            return initialState;

        case GAME_QUIT:
            return produce(input, state => {
                state.toMillisUTC = new Date().getTime();
            });

        case GAME_START:
            return produce(input, state => {
                state.fromMillisUTC = new Date().getTime();
            });

        case GAME_VICTORY:
            return produce(input, state => {
                state.toMillisUTC = new Date().getTime();
            });

        case GAME_TICK:
            return produce(input, state => {
                // noinspection JSUnresolvedVariable
                state.daysElapsed = Math.floor(GAME_DAYS_PER_SECOND *
                    (!!state.toMillisUTC ? state.toMillisUTC - state.fromMillisUTC :
                            new Date().getTime() - state.fromMillisUTC
                    ) / 1000);
            });

        default:
            return !!input ? input : initialState;
    }
};

// /**
//  * Player UI: Do some action
//  * @param myParam
//  * @returns {}
//  */
// export const doDepartmentOpen = function (myParam) {
//     return {
//         type: DEPARTMENT_OPEN,
//         myParam
//     }
// }

/**
 Get the game status
 */
export const selectDaysElapsed = () => {
    return createSelector(
        [(state) => {
            return state.board.daysElapsed;
        }],
        (value) => {
            return value;
        });
};

/**
 Get the entire slice of board store for a given player

 @return {*}
 */
export const selectPlayerData = () => {
    return createSelector(
        [(state) => {
            return state.board.player;
        }],
        (value) => {
            return value;
        });
};
