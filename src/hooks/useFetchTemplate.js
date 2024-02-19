import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

export async function useFetchTemplate(id) {
  async function fetchTemplate(id) {
    const data = await http().get(`${endpoints.templates.getAll}/${id}`);
    console.log({ data });
    return data;
  }
  return useQuery({
    queryKey: [id],
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
  });
}
