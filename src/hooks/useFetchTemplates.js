import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

const fetchTemplates = async () => {
  return await http().get(endpoints.templates.getAll);
};

export function useFetchTemplates() {
  return useQuery(["templates"], () => fetchTemplates());
}
