import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

const fetchCategories = async () => {
  const data = await http().get(endpoints.categories.getAll);
  return (
    data?.data?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? []
  );
};

export function useFetchCategories() {
  return useQuery(["categories"], () => fetchCategories());
}
