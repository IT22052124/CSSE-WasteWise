import { Bounce, ToastContainer as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => {
  return (
    <Toast
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  );
};

export default ToastContainer;
