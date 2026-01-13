// src/pages/Assessments/AssessmentList.jsx

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BarChart,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import assessmentService from "../../services/assessmentService";
import Modal from "../../components/Common/Modal";
import Button from "../../components/Common/Button";
import AssessmentForm from "./AssessmentForm";

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAll();
      setAssessments(data);
      setError(null);
    } catch (err) {
      setError("Failed to load assessments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAssessment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      await assessmentService.delete(id);
      setAssessments(assessments.filter((a) => a.id !== id));
      alert("Assessment deleted successfully");
    } catch (err) {
      alert("Failed to delete assessment");
      console.error(err);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const updated = await assessmentService.toggleActive(id, !currentStatus);
      setAssessments(assessments.map((a) => (a.id === id ? updated : a)));
      alert(
        `Assessment ${
          !currentStatus ? "activated" : "deactivated"
        } successfully`
      );
    } catch (err) {
      alert("Failed to update assessment status");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (selectedAssessment) {
        const updated = await assessmentService.update(
          selectedAssessment.id,
          formData
        );
        setAssessments(
          assessments.map((a) => (a.id === selectedAssessment.id ? updated : a))
        );
        alert("Assessment updated successfully");
      } else {
        const created = await assessmentService.create(formData);
        setAssessments([created, ...assessments]);
        alert("Assessment created successfully");
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save assessment");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setSelectedAssessment(null);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      quiz: "Quiz",
      test: "Test",
      survey: "Survey",
      evaluation: "Evaluation",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      quiz: "bg-blue-100 text-blue-700",
      test: "bg-purple-100 text-purple-700",
      survey: "bg-green-100 text-green-700",
      evaluation: "bg-orange-100 text-orange-700",
    };
    return colors[type] || "bg-slate-100 text-slate-700";
  };

  // Filter assessments
  const filteredAssessments = assessments
    .filter((assessment) => {
      const matchesSearch =
        assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || assessment.type === filterType;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && assessment.active) ||
        (filterStatus === "inactive" && !assessment.active);

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Assessments</h2>
          <p className="text-slate-600 mt-1">
            Manage quizzes, tests, and evaluations
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary" icon={Plus}>
          Add Assessment
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          {["all", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {status}
            </button>
          ))}

          {/* Type Filter */}
          {["all", "quiz", "test", "survey", "evaluation"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                ${
                  filterType === type
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {type === "all" ? "All Types" : getTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Assessments List */}
      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <BarChart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">
            {searchTerm
              ? "No assessments found matching your search"
              : "No assessments yet. Create your first assessment!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        assessment.type
                      )}`}
                    >
                      {getTypeLabel(assessment.type)}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        assessment.active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {assessment.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {assessment.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {assessment.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-slate-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <FileText size={16} />
                  </div>
                  <p className="text-xs text-slate-500">Questions</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {assessment.questions?.length || 0}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Clock size={16} />
                  </div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {assessment.duration}m
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <CheckCircle size={16} />
                  </div>
                  <p className="text-xs text-slate-500">Pass Score</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {assessment.passingScore}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    handleToggleActive(assessment.id, assessment.active)
                  }
                  variant="outline"
                  size="sm"
                  icon={assessment.active ? EyeOff : Eye}
                  className="flex-1"
                >
                  {assessment.active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  onClick={() => handleEdit(assessment)}
                  variant="outline"
                  size="sm"
                  icon={Edit}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(assessment.id)}
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedAssessment ? "Edit Assessment" : "Add New Assessment"}
        size="xl"
      >
        <AssessmentForm
          assessment={selectedAssessment}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default AssessmentList;
