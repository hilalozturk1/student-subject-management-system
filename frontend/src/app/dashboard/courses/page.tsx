"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function Courses() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editCourse, setEditCourse] = useState({ name: "", description: "" });
  const token = Cookies.get("access_token");
  const is_staff = Cookies.get("is_staff") === "true";

  useEffect(() => {
    if (token) {
      api.get("/api/courses/", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setCourses(res.data.results));
    }
  }, [token]);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await api.post("/api/courses/", newCourse, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewCourse({ name: "", description: "" });
    const res = await api.get("/api/courses/", { headers: { Authorization: `Bearer ${token}` } });
    setCourses(res.data.results);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/courses/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCourses(courses.filter((c: any) => c.id !== id));
  };

  const handleEdit = (course: any) => {
    setEditId(course.id);
    setEditCourse(course);
  };
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    await api.put(`/api/courses/${editId}/`, editCourse, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditId(null);
    const res = await api.get("/api/courses/", { headers: { Authorization: `Bearer ${token}` } });
    setCourses(res.data.results);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      {is_staff && (
        <form onSubmit={handleAdd} className="mb-4 flex gap-2">
          <input required placeholder="Name" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} />
          <input placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
          <button type="submit" className="bg-blue-500 text-white px-2 rounded">Add</button>
        </form>
      )}
      <ul>
        {courses.length === 0 ? (
          <li>No courses found.</li>
        ) : (
          courses.map((c: any) => (
            <li key={c.id} className="mb-2">
              {editId === c.id ? (
                <form onSubmit={handleUpdate} className="flex gap-2">
                  <input value={editCourse.name} onChange={e => setEditCourse({ ...editCourse, name: e.target.value })} />
                  <input value={editCourse.description} onChange={e => setEditCourse({ ...editCourse, description: e.target.value })} />
                  <button type="submit" className="bg-green-500 text-white px-2 rounded">Save</button>
                  <button onClick={() => setEditId(null)} className="bg-gray-300 px-2 rounded">Cancel</button>
                </form>
              ) : (
                <>
                  <span className="font-semibold">{c.name}</span> - {c.description}
                  {is_staff && (
                    <>
                      <button onClick={() => handleEdit(c)} className="ml-2 text-blue-600">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="ml-2 text-red-600">Delete</button>
                    </>
                  )}
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}