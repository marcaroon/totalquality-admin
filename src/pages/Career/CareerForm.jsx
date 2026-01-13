// src/pages/Careers/CareerForm.jsx

import React, { useState, useEffect } from "react";
import Input from "../../components/Common/Input";
import Textarea from "../../components/Common/TextArea";
import Button from "../../components/Common/Button";
import { Save, X } from "lucide-react";

const CareerForm = ({ career, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time",
    description: "",
    requirements: "",
    responsibilities: "",
    salary: "",
    status: "open",
    deadline: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (career) {
      const deadline = career.deadline
        ? new Date(career.deadline).toISOString().slice(0, 10)
        : "";
      setFormData({
        title: career.title || "",
        department: career.department || "",
        location: career.location || "",
        type: career.type || "full-time",
        description: career.description || "",
        requirements: career.requirements || "",
        responsibilities: career.responsibilities || "",
        salary: career.salary || "",
        status: career.status || "open",
        deadline,
      });
    }
  }, [career]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    // Tambah validasi lain jika perlu
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData); // Kirim langsung ke service
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
      <Input
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        disabled={isLoading}
      />
      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        disabled={isLoading}
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
      >
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
      </select>
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        disabled={isLoading}
      />
      <Textarea
        label="Requirements"
        name="requirements"
        value={formData.requirements}
        onChange={handleChange}
        rows={4}
        disabled={isLoading}
      />
      <Textarea
        label="Responsibilities"
        name="responsibilities"
        value={formData.responsibilities}
        onChange={handleChange}
        rows={4}
        disabled={isLoading}
      />
      <Input
        label="Salary"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="e.g., $50,000 - $70,000"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
      >
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
      <Input
        label="Deadline"
        type="date"
        name="deadline"
        value={formData.deadline}
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
          {isLoading ? "Saving..." : career ? "Update Career" : "Create Career"}
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

export default CareerForm;
