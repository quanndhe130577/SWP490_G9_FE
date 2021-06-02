import Local from "./local";
import Config from "./config";
import helper from "./helper";
import i18next from "i18next";
import Swal from "sweetalert2";

// import DeviceDetector from "device-detector-js";
// const deviceDetector = new DeviceDetector();

let request = {};
request.upload = async (url, formData, method = "PUT") => {
  url = `${Config.host}${url}`;
  let option = {
    method: method,
    body: formData,
    headers: {
      Authorization: `Bearer ${Local.get("session") || "customer"}`,
    },
  };
  if (Config.debug) console.log(`[POST]`, url, option);
  let res = await fetch(url, option);
  let rs = await res.json();
  if (res.status !== 200) {
    console.log(res);
    throw rs;
  }
  if (Config.debug) console.log(`[RESPONSE]`, url, rs);
  return rs;
};
request.request = async (url, data, headers, method = "POST") => {
  url = `${Config.host}${url}`;
  let option = {
    method, // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      // "Content-Type": "application/json; charset=UTF-8",
      // Authorization: `Bearer ${Local.get("session") || "customer"}`,
      // device: JSON.stringify(deviceDetector.parse(navigator.userAgent)),
    },
  };
  option.headers = Object.assign({}, option.headers, headers);
  if (method === "GET") delete option.body;

  if (Config.debug) console.log(`[${method}]`, url, option);

  let res = await fetch(url, option);
  try {
    let rs = await res.json();
    if (Config.debug) console.log(`[RESPONSE]`, url, rs);
    switch (res.status) {
      // case 401:
      //   return Swal.fire({
      //     title: 'Session Expired!',
      //     html: "Your session is expired. Do you want to extend the session?",
      //     icon: 'warning',
      //     timer: 15000,
      //     timerProgressBar: true,
      //     showCancelButton: true,
      //     cancelButtonText: 'Logout',
      //     cancelButtonColor: '#d33',
      //     confirmButtonColor: '#3085d6',
      //     confirmButtonText: 'Continue session',
      //   }).then(async result => {
      //     if (result.value) {
      //       let rs = await api.refreshToken({ token: Local.get('session') })
      //       if (rs && rs.errorCode === 0) {
      //         Local.set('session', rs.data);
      //         window.history.go()
      //       }
      //     } else {
      //       Local.clear();
      //       window.location.href = '/';
      //     }
      //   })
      //   break;
      case 403:
        Swal.fire({
          title: i18next.t("forbidden"),
          text: "You don't have permission",
          icon: "error",
          confirmButtonText: "OK",
        });
        break;
      case 500:
        helper.toast("error", rs.errorMsg || i18next.t("internalServerError"));
        break;
      case 200:
        if (rs && rs.errorCode === 0) {
          return rs;
        } else {
          helper.toast(
            "error",
            rs.errorMsg || i18next.t("internalServerError")
          );
          break;
        }
      case 404:
        helper.toast("error", rs.errorMsg || i18next.t("dataNotFound"));
        break;
      case 400:
        if (rs.code && rs.code == "E_MISSING_OR_INVALID_PARAMS") {
          helper.toast("error", "Invalid parameters");
        } else {
          helper.toast("error", rs.errorMsg || i18next.t("badRequest"));
        }
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
