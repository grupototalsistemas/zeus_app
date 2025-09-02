import { Middleware } from "@reduxjs/toolkit";
import multi from 'redux-multi';
// import totalMiddleware from "./totalMiddleware";

// Logger opcional para debug
const logger: Middleware = (store) => (next) => (action) => {
  // console.log("DISPATCHING:", action);
  const result = next(action);
  // console.log("NEXT STATE:", store.getState());
  return result;
};

// Lista de middlewares
export const middlewares = [multi, logger]; // <- REMOVIDO O THUNK
