"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import TemplateForm from "@/components/Forms/Template";

async function updateTemplate(data) {
  return http().put(`${endpoints.templates.getAll}/${data.templateId}`, data);
}

export default function Page({ params: { id } }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation(updateTemplate, {
    onSuccess: () => {
      toast.success("Template updated.");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, templateId: id });
  };
  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <TemplateForm
        handleUpdate={handleUpdate}
        type={"edit"}
        templateId={id}
        updateMutation={updateMutation}
      />
    </div>
  );
}
