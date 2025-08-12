// import { Middleware } from "@reduxjs/toolkit";
// import {
//   patchOrder,
//   removeProduct,
//   storeOrder,
//   updateProductQuantity,
//   updateTotals,
// } from "../slices/orderSlice";

// // Analisar a possibilidade de utilizar Set para melhorar desempenho em arrays grandes.

// const actionsToWatch = [
//   storeOrder.type,
//   patchOrder.type,
//   removeProduct.type,
//   updateProductQuantity.type,
// ];

// const totalMiddleware: Middleware = (store) => (next) => (action: any) => {
//   const result = next(action);

//   if (actionsToWatch.includes(action.type)) {
//     console.log("totalMiddleware executado");
//     store.dispatch(updateTotals());
//   }

//   return result;
// };

// export default totalMiddleware;
