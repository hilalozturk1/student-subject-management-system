"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function Students() {
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ first_name: "", last_name: "", email: "", date_of_birth: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editStudent, setEditStudent] = useState({ first_name: "", last_name: "", email: "", date_of_birth: "" });
  const token = Cookies.get("access_token");
  const is_staff = Cookies.get("is_staff") === "true";
  
  useEffect(() => {
    if (token) {
      api.get("/api/students/", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setStudents(res.data.results));
    }
  }, [token]);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await api.post("/api/students/", newStudent, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewStudent({ first_name: "", last_name: "", email: "", date_of_birth: "" });
    const res = await api.get("/api/students/", { headers: { Authorization: `Bearer ${token}` } });
    setStudents(res.data.results);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/students/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStudents(students.filter((s: any) => s.id !== id));
  };

  const handleEdit = (student: any) => {
    setEditId(student.id);
    setEditStudent(student);
  };
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    await api.put(`/api/students/${editId}/`, editStudent, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditId(null);
    const res = await api.get("/api/students/", { headers: { Authorization: `Bearer ${token}` } });
    setStudents(res.data.results);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Students {is_staff}</h2>
      {is_staff && (
        <form onSubmit={handleAdd} className="mb-4 flex gap-2">
          <input required placeholder="First Name" value={newStudent.first_name} onChange={e => setNewStudent({ ...newStudent, first_name: e.target.value })} />
          <input required placeholder="Last Name" value={newStudent.last_name} onChange={e => setNewStudent({ ...newStudent, last_name: e.target.value })} />
          <input required placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} />
          <input required type="date" value={newStudent.date_of_birth} onChange={e => setNewStudent({ ...newStudent, date_of_birth: e.target.value })} />
          <button type="submit" className="bg-blue-500 text-white px-2 rounded">Add</button>
        </form>
      )}
      <ul>
        {students.length === 0 ? (
          <li>No students found.</li>
        ) : (
          students.map((s: any) => (
            <li key={s.id} className="mb-2">
              {editId === s.id ? (
                <form onSubmit={handleUpdate} className="flex gap-2">
                  <input value={editStudent.first_name} onChange={e => setEditStudent({ ...editStudent, first_name: e.target.value })} />
                  <input value={editStudent.last_name} onChange={e => setEditStudent({ ...editStudent, last_name: e.target.value })} />
                  <input value={editStudent.email} onChange={e => setEditStudent({ ...editStudent, email: e.target.value })} />
                  <input type="date" value={editStudent.date_of_birth} onChange={e => setEditStudent({ ...editStudent, date_of_birth: e.target.value })} />
                  <button type="submit" className="bg-green-500 text-white px-2 rounded">Save</button>
                  <button onClick={() => setEditId(null)} className="bg-gray-300 px-2 rounded">Cancel</button>
                </form>
              ) : (
                <>
                  <span className="font-semibold">{s.first_name} {s.last_name}</span> - {s.email}
                  {is_staff && (
                    <>
                      <button onClick={() => handleEdit(s)} className="ml-2 text-blue-600">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="ml-2 text-red-600">Delete</button>
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