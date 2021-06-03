import React from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
toast.configure();
let helper = {};

helper.toast = (type, content, disableAutoClose) => {
    let autoClose = 3000;
    if (disableAutoClose) {
        autoClose = false
    }
    if (type) {
        toast[type](Toast(type, content), { position: toast.POSITION.TOP_RIGHT, autoClose })
    } else {
        toast(Toast(type, content), { position: toast.POSITION.TOP_RIGHT, autoClose })
    }

}
const Toast = (type, content) => {
    let icon = "fa fa-info-circle"; // info
    if (type === "success") {
        icon = "fa fa-check"
    } else if (type === "error") {
        icon = "fa fa-shield"
    } else if (type === "warning") {
        icon = "fa fa-exclamation-triangle"
    }
    else if (type === "info") {
        icon = "fa fa-info-circle"
    }
    else if (type === "dark") {
        icon = "fa fa-info-circle"
    } else {
        icon = "fa fa-newspaper-o"
    }
    return (
        <div>
            <i className={icon} aria-hidden="true"></i> &nbsp;{content}
        </div>
    )
}

export default helper;