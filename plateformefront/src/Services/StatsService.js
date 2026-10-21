import { api } from "./Api";
export const getStats = () => api.get("/admin/stats");