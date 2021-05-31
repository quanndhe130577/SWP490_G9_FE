import Swal from 'sweetalert2';
let modal = {};

modal.success = async (msg) => {
    return Swal.fire({
        title: 'Success !',
        text: msg,
        icon: 'success',
        showCancelButton: true,
        showCloseButton: true
    })
}

modal.error = async (msg) => {
    return Swal.fire({
        title: 'Error !',
        text: msg,
        icon: 'error',
        showCancelButton: true,
        showCloseButton: true
    })
}

modal.confirm = async (msg) => {
    return Swal.fire({
        title: 'Confirm !',
        text: msg,
        icon: 'question',
        showCancelButton: true,
        showCloseButton: true
    })
}
modal.showModal = async () => {

}

modal.showQuesWithNote = (title, input, textCheckRequired) => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: title,
            input: input,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            preConfirm: (val) => {
                if (textCheckRequired && !val) Swal.showValidationMessage(textCheckRequired)
            }
        }).then((result) => resolve(result)).catch(error => reject())
    })
}

// attributes = [{id:'password', isRequired:true}]
// html = <input type="password" id="password" class="swal2-input" placeholder="Password"/>
// title = any text
modal.showQuesWithForm = (title, html, attributes = []) => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title, html,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            focusConfirm: false,
            preConfirm: () => {
                let objData = {};
                for (let i = 0; i < attributes.length; i++) {
                    let val = Swal.getPopup().querySelector(`#${attributes[i].id}`).value;
                    if (attributes[i].isRequired && !val) {
                        return Swal.showValidationMessage(`Please enter ${attributes[i].id}`);
                    } else {
                        objData[attributes[i].id] = val;
                    }
                }
                return objData;
            }
        }).then((result) => resolve(result)).catch(error => reject())
    })
}
export default modal;