/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

// app
import {produce} from "immer";
import {createSelector} from "reselect";
import {MILLIS_PER_SECOND, TICKS_PER_SECOND} from "../constants";

// Constants to identify Redux actions
export const
  GAME_LOSS = 'GAME_LOSS',
  GAME_NEW = 'GAME_NEW',
  GAME_QUIT = 'GAME_QUIT',
  GAME_START = 'GAME_START',
  GAME_VICTORY = 'GAME_VICTORY',
  GAME_TICK = 'GAME_TICK';

export const
  STATUS_LOBBY = 'LOBBY',
  STATUS_PLAYING = 'PLAYING',
  STATUS_VICTORY = 'VICTORY',
  STATUS_DEFEAT = 'DEFEAT';

export const
  PLAYER_UPDATE = 'PLAYER_UPDATE';

// Setup the initial state
const initialState = {
  status: STATUS_LOBBY,
  tickIntervalId: null,
  // Only one player for one
  // The GameEngine contains the player name (NOT reset between matches)
  player: [
    {
      name: 'Player 1',
    }
  ],
};

/**
 * The Redux reducer of a game state to an updated game state
 * @param baseState to update
 * @param {{
 *     type:string,
 *     tickIntervalId,
 *     playerId:number,
 *     playerInfo:{name:string},
 * }} action to reduce
 * @return {Reducer} updated state
 */
export const gameReducer = function (baseState, action) {

  // previous state, else (if undefined) new initial state
  const state = !!baseState ? baseState : initialState;

  // use mutate the requested key+value
  switch (action.type) {
    case GAME_LOSS:
      // TODO notification: error(`${baseState.player[0].name} is Defeated!`);
      return produce(baseState, nextState => {
        clearInterval(nextState.tickIntervalId);
        nextState.tickIntervalId = null;
        nextState.status = STATUS_DEFEAT;
      });

    case GAME_NEW:
      return produce(baseState, nextState => {
        clearInterval(nextState.tickIntervalId);
        nextState.tickIntervalId = null;
        nextState.status = STATUS_LOBBY;
      });

    case GAME_QUIT:
      // TODO notification: error(`${baseState.player[0].name} Quit!`);
      return produce(baseState, nextState => {
        clearInterval(nextState.tickIntervalId);
        nextState.tickIntervalId = null;
        nextState.status = STATUS_DEFEAT;
      });

    case GAME_START:
      // TODO notification: warning(`Bankrupt the Enemy!`);
      return produce(baseState, nextState => {
        nextState.tickIntervalId = action.tickIntervalId;
        nextState.status = STATUS_PLAYING;
      });

    case GAME_VICTORY:
      // TODO notification: success(`${baseState.player[0].name} Wins!`)
      return produce(baseState, nextState => {
        clearInterval(nextState.tickIntervalId);
        nextState.tickIntervalId = null;
        nextState.status = STATUS_VICTORY;
      });

    case PLAYER_UPDATE:
      return produce(baseState, nextState => {
        for (let k in action.playerInfo)
          if (action.playerInfo.hasOwnProperty(k))
            nextState.player[action.playerId][k] = action.playerInfo[k];
        // TODO notification: info(`Hello, ${nextState.player[action.playerId].name}!`);
      });

    default:
      return state;
  }
};

/**
 * GameView action: Every 1 second, Increase game clock by 1 day
 * @returns {{type: string}}
 */
export const doTimeTick = function () {
  return {
    type: GAME_TICK
  }
}

/**
 * GameView action: When player is broke for 180 days, GameView over, transition to display Post-game screen
 * @returns {{type: string}}
 */
export const doGameLoss = function () {
  return {
    type: GAME_LOSS
  }
}

/**
 * GameView action: When player reaches 100% market share, You win, transition to display Post-game screen
 * @returns {{type: string}}
 */
export const doGameVictory = function () {
  return {
    type: GAME_VICTORY
  }
}

/**
 * Player UI: Display player setup screen
 * @returns {{type: string}}
 */
export const doGameNew = function () {
  return {
    type: GAME_NEW
  }
}

/**
 * Player UI: GameView quit, transition to display Post-game screen
 * @returns {{type: string}}
 */
export const doGameQuit = function () {
  return {
    type: GAME_QUIT
  }
}

/**
 Player UI: Update some player info with new <Player Info>

 @param playerId to update
 @param playerInfo new information for update
 @returns {{playerInfo: *, type: string}}
 */
export const doPlayerUpdate = function (playerId, playerInfo) {
  return {
    type: PLAYER_UPDATE,
    playerId,
    playerInfo
  }
}

/**
 * Player UI: Start game clock at 0, display board, game is live
 * @returns {Function}
 */
export const doGameStart = function () {
  return function (dispatch) {
    let tickIntervalId = setInterval(() => dispatch(doTimeTick()), MILLIS_PER_SECOND / TICKS_PER_SECOND);
    return dispatch({
      type: GAME_START,
      tickIntervalId
    });
  }
}

/**
 Get the game status
 */
export const selectGameStatus = () => {
  return createSelector(
    [(state) => {
      return state.game.status;
    }],
    (value) => {
      return value;
    });
};

/**
 Get the name for a given player

 @param id which player (numbered starting at 0) you want the name for
 @return {*}
 */
export const selectPlayerName = (id) => {
  return createSelector(
    [(state) => {
      return state.game.player[id].name;
    }],
    (value) => {
      return value;
    });
};
