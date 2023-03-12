import { Flip, toast, ToastContainerProps } from "react-toastify"

const ToastifyConfig: ToastContainerProps = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    limit: 3,
    theme: "colored",
    transition: Flip,
}

export { ToastifyConfig }
