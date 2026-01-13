// src/pages/News/NewsForm.jsx

import React, { useState, useEffect } from "react";
import Input from "../../components/Common/Input";
import Textarea from "../../components/Common/TextArea";
import Button from "../../components/Common/Button";
import { Save, X, Upload, Link as LinkIcon } from "lucide-react";

const NewsForm = ({ news, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    author: "",
    image: "",
    published: true,
  });

  const [errors, setErrors] = useState({});
  const [imageMode, setImageMode] = useState("url");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        summary: news.summary || "",
        content: news.content || "",
        author: news.author || "",
        image: news.image || "",
        published: news.published ?? true,
      });
      setImagePreview(news.image || "");
    }
  }, [news]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = { ...formData };
    if (imageFile) submitData.imageFile = imageFile; // Kirim ke service untuk FormData

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        disabled={isLoading}
      />
      <Textarea
        label="Summary"
        name="summary"
        value={formData.summary}
        onChange={handleChange}
        rows={3}
        disabled={isLoading}
      />
      <Textarea
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        rows={6}
        error={errors.content}
        disabled={isLoading}
      />
      <Input
        label="Author"
        name="author"
        value={formData.author}
        onChange={handleChange}
        disabled={isLoading}
      />

      {/* Image Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Image
        </label>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setImageMode("url")}
            className={`px-3 py-1 rounded ${
              imageMode === "url" ? "bg-blue-600 text-white" : "bg-slate-200"
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setImageMode("upload")}
            className={`px-3 py-1 rounded ${
              imageMode === "upload" ? "bg-blue-600 text-white" : "bg-slate-200"
            }`}
          >
            Upload
          </button>
        </div>
        {imageMode === "url" ? (
          <Input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            icon={LinkIcon}
            disabled={isLoading}
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 max-h-48 rounded-lg border border-slate-200"
          />
        )}
      </div>

      {/* Published Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          checked={formData.published}
          onChange={handleChange}
          disabled={isLoading}
          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-slate-700">
          Publish immediately
        </span>
      </label>

      <div className="flex gap-3 mt-6">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          icon={Save}
        >
          {isLoading ? "Saving..." : news ? "Update News" : "Create News"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          icon={X}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default NewsForm;
