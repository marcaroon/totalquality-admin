/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getHeroes, createHero, deleteHero } from '../../services/heroService';
import api from '../../services/api'; // Pastikan import axios instance Anda
import Button from '../../components/Common/Button';

const HeroManager = () => {
  // State untuk Images
  const [heroes, setHeroes] = useState([]);
  const [file, setFile] = useState(null);
  
  // State untuk Content Text
  const [content, setContent] = useState({
    heading: '',
    subheading: '',
    ctaText: '',
    ctaLink: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  // Fetch Data Awal
  useEffect(() => {
    fetchHeroes();
    fetchContent();
  }, []);

  const fetchHeroes = async () => {
    try {
      const data = await getHeroes();
      setHeroes(data);
    } catch (error) { console.error(error); }
  };

  const fetchContent = async () => {
    try {
      const res = await api.get('/hero-content');
      if (res.data) setContent(res.data);
    } catch (error) { console.error("Belum ada konten", error); }
  };

  // Handler Upload Gambar (Sama seperti sebelumnya)
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      await createHero(formData);
      setFile(null);
      document.getElementById('fileInput').value = "";
      fetchHeroes();
    } catch (error) { alert("Gagal upload"); }
    finally { setLoading(false); }
  };

  // Handler Hapus Gambar
  const handleDelete = async (id) => {
    if (confirm("Hapus gambar ini?")) {
      await deleteHero(id);
      fetchHeroes();
    }
  };

  // Handler Update Teks
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/hero-content', content);
      alert("Teks Hero berhasil diupdate!");
    } catch (error) {
      console.error(error);
      alert("Gagal update teks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manajemen Hero Section</h1>

      {/* 1. BAGIAN EDIT TEKS OVERLAY */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Tulisan Hero (Title & Subtitle)</h2>
        <form onSubmit={handleContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Heading Utama (Besar)</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={content.heading}
              onChange={(e) => setContent({...content, heading: e.target.value})}
              placeholder="Contoh: UNLEASH YOUR POTENTIAL"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subheading (Kecil)</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="3"
              value={content.subheading || ''}
              onChange={(e) => setContent({...content, subheading: e.target.value})}
              placeholder="Deskripsi singkat..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Teks Tombol</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={content.ctaText || ''}
                onChange={(e) => setContent({...content, ctaText: e.target.value})}
                placeholder="Contoh: GET STARTED"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link Tombol</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={content.ctaLink || ''}
                onChange={(e) => setContent({...content, ctaLink: e.target.value})}
                placeholder="/about atau https://..."
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan Teks'}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. BAGIAN UPLOAD GAMBAR SLIDER */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Manajemen Gambar Background</h2>
        <form onSubmit={handleUpload} className="flex gap-4 items-center mb-6">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded w-full"
          />
          <Button type="submit" disabled={loading}>Upload Gambar</Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroes.map((hero) => (
            <div key={hero.id} className="relative group rounded-lg overflow-hidden border">
              <img 
                src={`http://localhost:3000${hero.image}`} 
                alt="Hero" 
                className="w-full h-32 object-cover"
              />
              <button 
                onClick={() => handleDelete(hero.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroManager;