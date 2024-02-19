"use client";
import React, { useState } from "react";
import TemplateForm from "@/components/Forms/Template";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";

async function postTemplate(data) {
  return http().post(endpoints.templates.getAll, data);
}
export default function Page() {
  const [isModal, setIsModal] = useState(false);
  const queryClient = useQueryClient();

  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const createMutation = useMutation(postTemplate, {
    onSuccess: () => {
      toast.success("New template added.");
      queryClient.invalidateQueries("templates");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="bg-white p-8 rounded-lg">
      <TemplateForm
        type={"create"}
        handleCreate={handleCreate}
        closeModal={closeModal}
        createMutation={createMutation}
      />
    </div>
  );
}
