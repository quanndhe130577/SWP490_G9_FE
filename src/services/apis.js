import request from "./request";

var apis = {};

var path = {
  login: "/api/login",
  logout: "/api/user/logout",
  register: "/api/register",
  getAllRole: "/api/role/get-all",
  getOtp: "/api/otp/register",
  checkOtp: "/api/OTP/check-register",
  updateUser: "/api/update",
  getPondOwnerByTraderId: "/api/pondOwner/getall", //method GET
  createPO: "/api/pondOwner/create",
  updatePO: "/api/pondOwner/update",
  deletePO: "/api/pondOwner/delete",
  getFTByTraderID: "/api/fishtype/getlastall", // method get, FT: fish type
  createFT: "/api/fishtype/create", // method post need param
};

Object.keys(path).forEach(function (key) {
  apis[key] = async function (data, method = "POST", param = "") {
    let url = path[key];
    if (param) {
      url = path[key] + "/" + param;
    }
    let result = await request.request(url, data, {}, method);
    return result;
  };
}, this);

export default apis;
