// src/pages/Forum/ForumForm.jsx

import React, { useState, useEffect } from "react";
import Textarea from "../../components/Common/TextArea";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import { Save, X } from "lucide-react";

const ForumForm = ({ post, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    quote: "",
    author: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      setFormData({
        quote: post.quote || "",
        author: post.author || "",
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.quote.trim()) newErrors.quote = "Quote is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Textarea
        label="Quote"
        name="quote"
        value={formData.quote}
        onChange={handleChange}
        error={errors.quote}
        rows={4}
        disabled={isLoading}
      />
      <Input
        label="Author"
        name="author"
        value={formData.author}
        onChange={handleChange}
        disabled={isLoading}
      />

      <div className="flex gap-3 mt-6">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          icon={Save}
        >
          {isLoading ? "Saving..." : post ? "Update Quote" : "Create Quote"}
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

export default ForumForm;
