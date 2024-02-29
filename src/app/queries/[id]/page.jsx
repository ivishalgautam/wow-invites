"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import Image from "next/image";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../components/ui/textarea";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { isObject } from "@/utils/object";
import { toast } from "sonner";

export default function Page({ params: { id } }) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm();
  const [details, setDetails] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") ?? 1;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["query", id],
    queryFn: () => getQuery(id),
    enabled: !!id,
  });

  console.log({ data });

  const getQuery = () => {
    return http().get(`${endpoints.queries.getAll}/${id}`);
  };

  if (isLoading) {
    return <Spinner />;
  }

  const fields = Object.groupBy(data?.fields, ({ page_number }) => page_number);
  const images = Object.groupBy(data?.images, ({ page_number }) => page_number);
  const maxPageNumber = Math.max(
    ...Object.keys(fields).map((d) => parseInt(d)),
  );

  const handlePageChange = async (pageNum) => {
    const checkFields = fields[page]?.map(({ name }) => name);
    const triggers = await trigger([...checkFields]);

    if (!triggers) return;

    setDetails((prev) =>
      !prev.map((pr) => pr.page_number).includes(page)
        ? [
            ...prev,
            Object.assign(
              { page_number: page },
              ...checkFields.map((d, ind) => ({
                [d]: getValues([...checkFields])[ind],
              })),
            ),
          ]
        : [...prev],
    );

    router.push(`?page=${pageNum}`);
  };

  const onSubmit = () => {};

  console.log({ page });

  return (
    <div className="flex h-full items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <div
            className={`grid min-h-[35rem] min-w-[40rem] max-w-2xl grid-cols-2 gap-8`}
          >
            <div className="relative overflow-hidden rounded-lg">
              <Image
                fill
                src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${images?.[page]?.[0]?.url}`}
                alt={data?.name}
                className="object-cover object-center"
              />
            </div>
            <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-lg bg-white">
              {parseInt(searchParams.get("page")) <= maxPageNumber && (
                <span className="absolute right-2 top-2 text-sm font-semibold text-gray-800">
                  {searchParams.get("page")}{" "}
                  <span className="font-medium">/</span> {maxPageNumber}
                </span>
              )}

              {/* fields */}
              <div
                className={`w-full space-y-4 ${parseInt(searchParams.get("page")) > maxPageNumber ? "divide-y" : ""} divide-primary p-8`}
              >
                {fields[page]?.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field?.name}>
                      {field?.name.split("_").join(" ")}
                    </Label>
                    {field?.type === "textarea" ? (
                      <Textarea
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        disabled
                      />
                    ) : (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* cta */}
              <div
                className={`sticky bottom-0 grid w-full grid-cols-3 gap-4 bg-white p-4`}
              >
                <Button type="button" disabled={page == 1}>
                  <Link href={`?page=${searchParams.get("page") - 1}`}>
                    Prev
                  </Link>
                </Button>
                <Button
                  type="button"
                  disabled={page >= maxPageNumber}
                  onClick={() => {
                    handlePageChange(parseInt(searchParams.get("page")) + 1);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
