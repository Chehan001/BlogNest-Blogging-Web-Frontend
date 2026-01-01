import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "../services/api";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageRef = ref(storage, `blogs/${image.name}`);
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);

    await axios.post("/blogs", {
      title,
      image: imageURL,
    });

    alert("Blog added!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-24">
      <input
        className="w-full border p-2 mb-4"
        placeholder="Blog title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded">
        Publish
      </button>
    </form>
  );
};

export default AddBlog;
