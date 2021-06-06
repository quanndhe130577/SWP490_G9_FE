import request from "./request";

var apis = {};

var path = {
  //login
  // login: "/user/loginWithPwd",
  login: "/api/login",
  logout: "/api/user/logout",
  register: "/api/register",
  getAllRole: "/api/role/get-all"
};

Object.keys(path).forEach(function (key) {
  apis[key] = async function (data, method = "POST") {
    let result = await request.request(path[key], data, {}, method);
    return result;
  };
}, this);

export default apis;
