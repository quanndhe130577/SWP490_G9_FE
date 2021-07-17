import apis from "./apis";
import constant from "./constant";
import local from "./local";
import session from "./session";
import request from "./request";
import helper from "./helper";
import modal from "./modal";
let services = {
  apis,
  constant,
  local,
  session,
  request,
  helper,
  modal,
};
export default services;

export { default as apis } from "./apis";
export { default as constant } from "./constant";
export { default as local } from "./local";
export { default as session } from "./session";
export { default as request } from "./request";
export { default as helper } from "./helper";
export { default as modal } from "./modal";
