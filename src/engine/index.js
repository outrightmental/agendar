/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

// vendor
import {configureStore} from "@reduxjs/toolkit"
// app
import {gameReducer} from "./GameEngine";
import {boardReducer} from "./BoardEngine";

/**

 +----------------+
 | HERE BE REDUX! |
 +----------------+

 - [redux](redux.js.org)-- see [the tutorial](https://redux.js.org/basics/actions)
 - [redux-toolkit](https://redux-toolkit.js.org/)— includes `redux-thunk` and `immer`

 */
export default configureStore({
  reducer: {
    game: gameReducer,
    board: boardReducer
  }
});
