"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CategoryForm } from "@/components/Forms/Category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints";
import Spinner from "@/components/Spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";

async function updateQuery(data) {
  return http().put(`${endpoints.queries.getAll}/${data.id}`, data);
}

async function deleteQuery(data) {
  return http().delete(`${endpoints.queries.getAll}/${data.id}`);
}

async function fetchQueries(page, limit) {
  return http().get(`${endpoints.queries.getAll}?page=${page}&limit=${limit}`);
}

export default function Queries({ searchParams }) {
  const page =
    typeof searchParams["page"] === "string" ? Number(searchParams["page"]) : 1;
  const limit =
    typeof searchParams["limit"] === "string"
      ? Number(searchParams["limit"])
      : 10;
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("");
  const [queryId, setQueryId] = useState(null);
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchQueries(page, limit),
    queryKey: ["queries", page, limit],
  });

  console.log({ data });

  const updateMutation = useMutation(updateQuery, {
    onSuccess: () => {
      toast.success("Query updated.");
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const deleteMutation = useMutation(deleteQuery, {
    onSuccess: () => {
      toast.success("Query deleted.");
      queryClient.invalidateQueries({ queryKey: ["queries"] });
      closeModal();
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: queryId });
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return JSON.stringify(error);
  }

  return (
    <div className="container mx-auto rounded-lg border-input bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Queries"} />
      </div>
      <div>
        <DataTable
          columns={columns(setType, openModal, setQueryId)}
          data={data?.queries?.map(
            ({
              id,
              user_fullname,
              template_name,
              delivery_date,
              email,
              mobile_number,
            }) => ({
              id,
              user_fullname,
              template_name,
              delivery_date,
              email,
              mobile_number,
            }),
          )}
          total_page={data?.total_page}
        />
      </div>

      {isModal && (
        <Modal isOpen={isModal} onClose={closeModal}>
          <div>
            <p className="text-center">Are you sure you want to delete!</p>
            <div className="text-end">
              <Button
                variant="destructive"
                onClick={() => handleDelete(queryId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
