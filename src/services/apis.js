import request from "./request";

var apis = {};

var path = {
  //login
  login: "/user/loginWithPwd",
  logout: "/api/user/logout",

};

Object.keys(path).forEach(function (key) {
  apis[key] = async function (data) {
    let result = await request.request(path[key], data);
    return result;
  };
}, this);

export default apis;
