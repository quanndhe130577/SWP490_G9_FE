import session from "./session";
import Config from "./config";
import helper from "./helper";
import i18next from "i18next";
import Swal from "sweetalert2";

// import DeviceDetector from "device-detector-js";
// const deviceDetector = new DeviceDetector();

let request = {};
// request.upload = async (url, formData, method = "PUT") => {
//   url = `${Config.host}${url}`;
//   let option = {
//     method: method,
//     body: formData,
//     headers: {
//       Authorization: `Bearer ${session.get("session") || "customer"}`,
//     },
//   };
//   if (Config.debug) console.log(`[POST]`, url, option);
//   let res = await fetch(url, option);
//   let rs = await res.json();
//   if (res.status !== 200) {
//     console.log(res);
//     throw rs;
//   }
//   if (Config.debug) console.log(`[RESPONSE]`, url, rs);
//   return rs;
// };
request.request = async (url, data, headers, method = "POST") => {
  url = `${Config.host}${url}`;
  // console.log("data " + data);
  let option = {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${session.get("session") || "customer"}`,
    },
  };
  option.headers = Object.assign({}, option.headers, headers);
  if (method === "GET") delete option.body;
  // console.log("opt " + option);

  let res = await fetch(url, option);
  try {
    switch (res.status) {
      case 401:
        helper.toast("error", i18next.t("Unauthorized"));
        // return Swal.fire({
        //   title: 'Session Expired!',
        //   html: "Your session is expired. Do you want to extend the session?",
        //   icon: 'warning',
        //   timer: 15000,
        //   timerProgressBar: true,
        //   showCancelButton: true,
        //   cancelButtonText: 'Logout',
        //   cancelButtonColor: '#d33',
        //   confirmButtonColor: '#3085d6',
        //   confirmButtonText: 'Continue session',
        // }).then(async result => {
        //   if (result.value) {
        //     let rs = await api.refreshToken({ token: session.get('session') })
        //     if (rs && rs.errorCode === 0) {
        //       session.set('session', rs.data);
        //       window.history.go()
        //     }
        //   } else {
        session.clear();
        window.location.href = "/";
        break;
      case 403:
        Swal.fire({
          title: i18next.t("forbidden"),
          text: "You don't have permission",
          icon: "error",
          confirmButtonText: "OK",
        });
        break;
      case 500:
        helper.toast("error", i18next.t(res.message || "internalServerError"));
        break;
      case 200:
        let rs = await res.json();
        if (Config.debug) console.log(`[RESPONSE]`, url, rs);
        if (rs && rs.statusCode === 200) {
          return rs;
        } else {
          helper.toast(
            "error",
            i18next.t(rs.Message || rs.message || "internalServerError")
          );
          break;
        }
      case 404:
        helper.toast("error", i18next.t("urlNotFound"));
        break;
      case 400:
        let result = await res.json();
        helper.toast("error", i18next.t(result.message || "badRequest"));
        break;
      default:
        throw rs;
    }
  } catch (err) {
    helper.toast("error", i18next.t("internalServerError"));
    console.log("res", res, err);
    throw err;
  }
};
request.fetch = async (url, data, headers, method = "POST") => {
  url = `${Config.host}${url}`;
  console.log("data " + data);
  let option = {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${session.get("session") || "customer"}`,
    },
  };
  option.headers = Object.assign({}, option.headers, headers);
  if (method === "GET") delete option.body;
  console.log("opt " + option);
  debugger;
  let res = await fetch(url, option);
  try {
    switch (res.status) {
      case 401:
        helper.toast("error", i18next.t("Unauthorized"));

        session.clear();
        window.location.href = "/";
        break;
      case 403:
        Swal.fire({
          title: i18next.t("forbidden"),
          text: "You don't have permission",
          icon: "error",
          confirmButtonText: "OK",
        });
        break;
      case 500:
        helper.toast("error", i18next.t(res.message || "internalServerError"));
        break;
      case 200:
        let rs = await res.json();
        if (Config.debug) console.log(`[RESPONSE]`, url, rs);
        if (rs && rs.statusCode === 200) {
          return rs;
        } else {
          helper.toast(
            "error",
            i18next.t(rs.Message || rs.message || "internalServerError")
          );
          break;
        }
      case 404:
        helper.toast("error", i18next.t("urlNotFound"));
        break;
      case 400:
        let result = await res.json();
        helper.toast("error", i18next.t(result.message || "badRequest"));
        break;
      default:
        throw rs;
    }
  } catch (err) {
    helper.toast("error", i18next.t("internalServerError"));
    console.log("res", res, err);
    throw err;
  }
};
export default request;
