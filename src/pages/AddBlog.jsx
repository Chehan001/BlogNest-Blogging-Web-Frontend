import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "../services/api";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload an image");

    try {
      const imageRef = ref(storage, `blogs/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageURL = await getDownloadURL(imageRef);

      await axios.post("/blogs", {
        title,
        content,
        category,
        image: imageURL,
      });

      alert("Blog added!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to create blog");
    }
  };

  const categories = ["Technology", "Design", "Travel", "Lifestyle", "Food", "Business", "Other"];

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-24 p-8">
      <h2 className="text-2xl font-bold mb-6">Write a Story</h2>

      <input
        className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <textarea
        className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px]"
        placeholder="Tell your story..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          required
        />
      </div>

      <button className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
        Publish Story
      </button>
    </form>
  );
};

export default AddBlog;
