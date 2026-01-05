import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  getCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/api/course.api";

const Courses = () => {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [previewImage, setPreviewImage] = useState("");
  const [finalImage, setFinalImage] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is too large before processing (Frontend safety)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image is too large. Please select a file under 10MB.");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFinalImage(reader.result);
      setUploading(false);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setUploading(false);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Logic: Use newly uploaded image, or keep old image, or empty
    const imageToSave = finalImage || editCourse?.image || "";

    const data = {
      title: form.title.value,
      description: form.description.value,
      image: imageToSave,
      // FIX: Ensure empty strings are sent as null/undefined for Mongoose ObjectIds
      tutorId: form.tutorId.value.trim() || null, 
      organizationId: form.organizationId.value.trim() || null,
      price: Number(form.price.value),
      published: form.published.value === "true",
    };

    try {
      if (editCourse) {
        const res = await updateCourse(editCourse._id, data);
        setCourses((prev) =>
          prev.map((c) => (c._id === editCourse._id ? res.data : c))
        );
      } else {
        const res = await createCourse(data);
        setCourses((prev) => [res.data, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      // Detailed alert for debugging
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCourse(null);
    setPreviewImage("");
    setFinalImage("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Course Management</h2>
          <p className="text-slate-500 text-sm">Create and organize your curriculum</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-semibold"
        >
          <Plus size={20} /> Add Course
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((item) => (
          <div key={item._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="h-44 bg-slate-200 relative">
              {item.image ? (
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400"><ImageIcon size={40} /></div>
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${item.published ? "bg-green-500 text-white" : "bg-slate-500 text-white"}`}>
                  {item.published ? "Live" : "Draft"}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mt-1 mb-4 h-10">{item.description}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditCourse(item); setPreviewImage(item.image); setShowModal(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-8 py-5 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-slate-800">{editCourse ? "Update Course" : "New Course"}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Banner</label>
                <div className="relative h-36 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer overflow-hidden">
                  {previewImage ? (
                    <>
                      <img src={previewImage} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="text-slate-300 mx-auto mb-2" size={28} />
                      <p className="text-xs text-slate-400 font-medium">Click to upload image</p>
                    </div>
                  )}
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                {uploading && <div className="flex items-center gap-2 text-xs text-blue-600"><Loader2 size={14} className="animate-spin"/> Processing image...</div>}
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                  <input name="title" defaultValue={editCourse?.title || ""} placeholder="Mastering React" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea name="description" defaultValue={editCourse?.description || ""} rows="2" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (₹)</label>
                    <input type="number" name="price" defaultValue={editCourse?.price || ""} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility</label>
                    <select name="published" defaultValue={editCourse?.published ? "true" : "false"} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor ID</label>
                    <input name="tutorId" defaultValue={editCourse?.tutorId || ""} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Org ID</label>
                    <input name="organizationId" defaultValue={editCourse?.organizationId || ""} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-lg font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
                <button disabled={uploading} className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:opacity-50 transition-all">
                  {editCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;