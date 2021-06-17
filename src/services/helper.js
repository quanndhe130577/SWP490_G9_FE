import React from "react";
// import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import i18n from "i18next";
import Swal from "sweetalert2";
toast.configure();
let helper = {};

helper.toast = (type, content, disableAutoClose) => {
  let autoClose = 3000;
  if (disableAutoClose) {
    autoClose = false;
  }
  if (type) {
    toast[type](Toast(type, content), {
      position: toast.POSITION.TOP_RIGHT,
      autoClose,
    });
  } else {
    toast(Toast(type, content), {
      position: toast.POSITION.TOP_RIGHT,
      autoClose,
    });
  }
};
const Toast = (type, content) => {
  let icon = "fa fa-info-circle"; // info
  if (type === "success") {
    icon = "fa fa-check";
  } else if (type === "error") {
    icon = "fa fa-shield";
  } else if (type === "warning") {
    icon = "fa fa-exclamation-triangle";
  } else if (type === "info") {
    icon = "fa fa-info-circle";
  } else if (type === "dark") {
    icon = "fa fa-info-circle";
  } else {
    icon = "fa fa-newspaper-o";
  }
  return (
    <div>
      <i className={icon} aria-hidden="true"></i> &nbsp;{content}
    </div>
  );
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
// helper.useHistory = (path) => {
//   let history = useHistory();
//   history.push(path);
// };

export default helper;
