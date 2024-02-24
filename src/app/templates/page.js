"use client";
import Video from "../../components/VideoThumbnail";
import { Button } from "../../components/ui/button";
import { useFetchTemplates } from "../../hooks/useFetchTemplates";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import Title from "@/components/Title";
import { columns } from "./columns";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TemplateForm from "../../components/Forms/Template.js";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import Link from "next/link";
import { useRouter } from "next/navigation";

async function deleteTemplate(data) {
  return http().delete(`${endpoints.templates.getAll}/${data.id}`);
}

export default function Page({ searchParams }) {
  const page =
    typeof searchParams["page"] === "string" ? Number(searchParams["page"]) : 1;
  const { data, isLoading, isError, error } = useFetchTemplates(page);
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation(deleteTemplate, {
    onSuccess: () => {
      toast.success("Template deleted.");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return toast.error(JSON.stringify(error?.message));
  }

  return (
    <div className="container mx-auto rounded-lg border-input bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Templates"} />

        <Button>
          <Link href="/templates/create">Create template</Link>
        </Button>
      </div>
      <div>
        <DataTable
          columns={columns(router, handleDelete)}
          data={data?.map(({ id, name, url }) => ({ id, name, url }))}
        />
      </div>
    </div>
  );
}
