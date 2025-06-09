"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function Enrollments() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const token = Cookies.get("access_token");
  const is_staff = Cookies.get("is_staff") === "true";

  // Listele
  useEffect(() => {
    if (token) {
      api.get("/api/enrollments/", {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        setEnrollments(res.data.results)
      });
      api.get("/api/courses/", {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => setCourses(res.data.results));
      api.get("/api/students/", {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        setStudents(res.data.results)
        !is_staff && setSelectedStudent((res.data.results[0].id).toString())
    });
    }
  }, [token, is_staff]);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const data: any = { course: selectedCourse };
    data.student = selectedStudent;
    await api.post("/api/enrollments/", data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSelectedCourse("");
    is_staff && setSelectedStudent("");
    const res = await api.get("/api/enrollments/", { headers: { Authorization: `Bearer ${token}` } });
    setEnrollments(res.data.results);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/enrollments/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEnrollments(enrollments.filter((e: any) => e.id !== id));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Enrollments</h2>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        {is_staff && (
          <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
            <option value="">Select student</option>
            {students.map((s: any) => (
              <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
            ))}
          </select>
        )}
        <select required value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">Select course</option>
          {courses.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-2 rounded">Add Enrollment</button>
      </form>
      <ul>
        {enrollments.length === 0 ? (
          <li>No enrollments found.</li>
        ) : (
          enrollments.map((e: any) => (
            <li key={e.id} className="mb-2">
              <span>
                {is_staff
                  ? `${e.student_name || e.student?.first_name + " " + e.student?.last_name} - ${e.course_name || e.course?.name}`
                  : `${e.course_name || e.course?.name}`}
              </span>
              <button onClick={() => handleDelete(e.id)} className="ml-2 text-red-600">Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}