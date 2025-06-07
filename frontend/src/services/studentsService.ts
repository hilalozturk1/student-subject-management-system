import api from "@/lib/api";

export const getStudents = async (token: string) => {
  return api.get('/api/students/', {
    headers: { Authorization: `Bearer ${token}` }
  });
};