import { useRef } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/storage/firebase";
import PropTypes from "prop-types";

const ImageUpload = ({ setDownloadURL, setProgress, setLoading, update }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the single file
    if (file) {
      setLoading(true);
      uploadImage(file);
    }
  };

  const uploadImage = (image) => {
    setProgress(0);

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url); // Set the download URL for the uploaded image
          setLoading(false);
        });
      }
    );
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: "none" }} // Hide the file input
      />
      <button
        className={
          "select-none bg-opacity-25 bg-blue-600 rounded-lg border border-blue-300 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-light-blue-700 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        }
        onClick={handleClick}
      >
        Upload
      </button>
    </div>
  );
};

ImageUpload.propTypes = {
  setDownloadURL: PropTypes.func.isRequired,
  setProgress: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default ImageUpload;
