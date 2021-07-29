import { notification } from "antd";
import i18n from "i18next";
import Swal from "sweetalert2";

let helper = {};

helper.toast = (type, message, duration = 2) => {
  let className = "noti-error";
  if (type === "success") {
    className = "noti-success";
  } else if (type === "warning") {
    className = "noti-warning";
  } else if (type === "info") {
    className = "noti-info";
  }
  notification[type]({
    message,
    duration,
    className,
  });
};

helper.renameKey = (obj, old_key, new_key) => {
  if (obj[old_key])
    if (old_key !== new_key) {
      Object.defineProperty(
        obj,
        new_key,
        Object.getOwnPropertyDescriptor(obj, old_key)
      );
      delete obj[old_key];
    }
};
helper.confirm = (content) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: content,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#17a2b8",
      cancelButtonColor: "#e67e22",
      confirmButtonText: i18n.t("yes"),
      cancelButtonText: i18n.t("cancel"),
    }).then((result) => {
      if (result.value) {
        resolve(true);
      }
    });
  });
};
helper.getDateFormat = (date = new Date(), format = "yyyy-mm-dd") => {
  // format date as type yyyy-mm-dd
  var d = new Date(date);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (format === "yyyy-mm-dd") return [year, month, day].join("-");
  else if (format === "ddmmyyyy") return day + month + year;
};
helper.correctDate = (dateDf) => {
  let date = dateDf;
  if (!date) {
    date = new Date();
  }
  date = new Date(date);
  let hoursDiff = date.getHours() - date.getTimezoneOffset() / 60;
  let minutesDiff = (date.getHours() - date.getTimezoneOffset()) % 60;
  date.setHours(hoursDiff);
  date.setMinutes(minutesDiff);
  return date;
};
export default helper;
