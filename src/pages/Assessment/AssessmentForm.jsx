// src/pages/Assessments/AssessmentForm.jsx

import React, { useState, useEffect } from "react";
import Input from "../../components/Common/Input";
import Textarea from "../../components/Common/TextArea";
import Button from "../../components/Common/Button";
import { Save, X, Plus, Trash2 } from "lucide-react";

const AssessmentForm = ({ assessment, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "quiz",
    duration: "",
    passingScore: "",
    active: true,
  });

  const [questions, setQuestions] = useState([
    {
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10,
    },
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title || "",
        description: assessment.description || "",
        type: assessment.type || "quiz",
        duration: assessment.duration || "",
        passingScore: assessment.passingScore || "",
        active: assessment.active !== undefined ? assessment.active : true,
      });

      if (assessment.questions && assessment.questions.length > 0) {
        setQuestions(assessment.questions);
      }
    }
  }, [assessment]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 10,
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    } else {
      alert("Assessment must have at least one question");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (
      !formData.passingScore ||
      formData.passingScore < 0 ||
      formData.passingScore > 100
    ) {
      newErrors.passingScore = "Passing score must be between 0 and 100";
    }

    // Validate questions
    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[`question_${index}`] = "Question text is required";
      }
      if (q.type === "multiple-choice") {
        const hasEmptyOption = q.options.some((opt) => !opt.trim());
        if (hasEmptyOption) {
          newErrors[`question_${index}_options`] = "All options must be filled";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        duration: parseInt(formData.duration),
        passingScore: parseInt(formData.passingScore),
        questions: questions,
        active: formData.active,
      };

      onSubmit(submitData);
    }
  };

  const assessmentTypes = [
    { value: "quiz", label: "Quiz" },
    { value: "test", label: "Test" },
    { value: "survey", label: "Survey" },
    { value: "evaluation", label: "Evaluation" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Assessment Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter assessment title"
        required
        error={errors.title}
        disabled={isLoading}
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the assessment purpose and content"
        required
        rows={3}
        error={errors.description}
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {assessmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Duration (minutes)"
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 60"
          required
          error={errors.duration}
          disabled={isLoading}
          min="1"
        />

        <Input
          label="Passing Score (%)"
          type="number"
          name="passingScore"
          value={formData.passingScore}
          onChange={handleChange}
          placeholder="e.g., 70"
          required
          error={errors.passingScore}
          disabled={isLoading}
          min="0"
          max="100"
        />
      </div>

      {/* Active Checkbox */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            disabled={isLoading}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Active (visible to users)
          </span>
        </label>
      </div>

      {/* Questions Section */}
      <div className="border-t border-slate-200 pt-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Questions</h3>
          <Button
            type="button"
            onClick={addQuestion}
            variant="outline"
            size="sm"
            icon={Plus}
          >
            Add Question
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="bg-slate-50 rounded-lg p-4 border border-slate-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-slate-800">
                  Question {qIndex + 1}
                </h4>
                <Button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  disabled={questions.length === 1}
                >
                  Remove
                </Button>
              </div>

              <Textarea
                label="Question Text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                placeholder="Enter your question here"
                required
                rows={2}
                error={errors[`question_${qIndex}`]}
                disabled={isLoading}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Question Type
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "type", e.target.value)
                    }
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                </div>

                <Input
                  label="Points"
                  type="number"
                  value={question.points}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "points",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="10"
                  min="1"
                  disabled={isLoading}
                />
              </div>

              {question.type === "multiple-choice" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() =>
                            handleQuestionChange(
                              qIndex,
                              "correctAnswer",
                              oIndex
                            )
                          }
                          disabled={isLoading}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          disabled={isLoading}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  {errors[`question_${qIndex}_options`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`question_${qIndex}_options`]}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Select the radio button for the correct answer
                  </p>
                </div>
              )}

              {question.type === "true-false" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Correct Answer
                  </label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "correctAnswer",
                        e.target.value === "true"
                      )
                    }
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          icon={Save}
        >
          {isLoading
            ? "Saving..."
            : assessment
            ? "Update Assessment"
            : "Create Assessment"}
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

export default AssessmentForm;
