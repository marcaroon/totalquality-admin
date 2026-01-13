// src/pages/News/NewsList.jsx

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Grid3x3,
  List,
  Eye,
  EyeOff,
  Newspaper,
} from "lucide-react";
import newsService from "../../services/newsService";
import Modal from "../../components/Common/Modal";
import Button from "../../components/Common/Button";
import NewsForm from "./NewsForm";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all"); // all, published, draft

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAll();
      setNews(data);
      setError(null);
    } catch (err) {
      setError("Failed to load news");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedNews(null);
    setIsModalOpen(true);
  };

  const handleEdit = (newsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) {
      return;
    }

    try {
      await newsService.delete(id);
      setNews(news.filter((n) => n.id !== id));
      alert("News deleted successfully");
    } catch (err) {
      alert("Failed to delete news");
      console.error(err);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const updated = await newsService.togglePublish(id, !currentStatus);
      setNews(news.map((n) => (n.id === id ? updated : n)));
      alert(
        `News ${!currentStatus ? "published" : "unpublished"} successfully`
      );
    } catch (err) {
      alert("Failed to update publish status");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (selectedNews) {
        const updated = await newsService.update(selectedNews.id, formData);
        setNews(news.map((n) => (n.id === selectedNews.id ? updated : n)));
        alert("News updated successfully");
      } else {
        const created = await newsService.create(formData);
        setNews([created, ...news]);
        alert("News created successfully");
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save news");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setSelectedNews(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter news
  const filteredNews = news
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterStatus === "published") {
        return matchesSearch && item.published;
      } else if (filterStatus === "draft") {
        return matchesSearch && !item.published;
      }
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">News</h2>
          <p className="text-slate-600 mt-1">
            Manage company news and articles
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary" icon={Plus}>
          Add News
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Status */}
        <div className="flex gap-2">
          {["all", "published", "draft"].map((status) => (
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
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`
              p-2 rounded-lg transition-colors
              ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
            title="Grid View"
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`
              p-2 rounded-lg transition-colors
              ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
            title="List View"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* News Display */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">
            {searchTerm
              ? "No news found matching your search"
              : "No news yet. Create your first article!"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`
                      inline-block px-3 py-1 rounded-full text-xs font-medium
                      ${
                        item.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {item.summary}
                </p>

                <div className="text-xs text-slate-500 mb-4">
                  <div>By {item.author}</div>
                  <div>{formatDate(item.createdAt)}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleTogglePublish(item.id, item.published)}
                    variant="outline"
                    size="sm"
                    icon={item.published ? EyeOff : Eye}
                    className="flex-1"
                  >
                    {item.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    onClick={() => handleEdit(item)}
                    variant="outline"
                    size="sm"
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  News
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium text-slate-900 line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-sm text-slate-500 line-clamp-1">
                          {item.summary}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 hidden lg:table-cell">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                        inline-block px-3 py-1 rounded-full text-xs font-medium
                        ${
                          item.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() =>
                          handleTogglePublish(item.id, item.published)
                        }
                        variant="outline"
                        size="sm"
                        icon={item.published ? EyeOff : Eye}
                      >
                        <span className="hidden sm:inline">
                          {item.published ? "Unpublish" : "Publish"}
                        </span>
                      </Button>
                      <Button
                        onClick={() => handleEdit(item)}
                        variant="outline"
                        size="sm"
                        icon={Edit}
                      >
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                      >
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedNews ? "Edit News" : "Add New News"}
        size="lg"
      >
        <NewsForm
          news={selectedNews}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default NewsList;
