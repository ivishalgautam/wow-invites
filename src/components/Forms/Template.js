"use client";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { endpoints } from "@/utils/endpoints";
import axios from "axios";
import useLocalStorage from "../../hooks/useLocalStorage.js";
import Title from "../Title";
import { HiTrash } from "react-icons/hi";
import ReactSelect from "react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import http from "@/utils/http";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFetchCategories } from "@/hooks/useFetchCategories";
export default function TemplateForm({
  type,
  handleCreate,
  handleUpdate,
  closeModal,
  createMutation,
  updateMutation,
  deleteMutation,
  templateId,
}) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fields: [
        {
          type: "",
          placeholder: "",
          page_number: "",
        },
      ],
      images: [
        {
          url: "",
          page_number: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  const {
    fields: imagesFields,
    append: imagesAppend,
    remove: imagesRemove,
  } = useFieldArray({
    control,
    name: "images",
  });
  const [token] = useLocalStorage("token");
  const { data: categories } = useFetchCategories();
  const handleFileChange = async (event, type) => {
    setIsUploading(true);
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
      console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );

            !type && setProgress(progress);
          },
        },
      );

      if (type) {
        return setValue(type, response.data.path[0]);
      }

      setVideoUrl(response.data.path[0]);

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      name: data?.name,
      price: data?.price,
      sale_price: data?.sale_price,
      fields: data?.fields,
      images: data?.images,
      url: videoUrl,
      category_id: data.category.value,
    };
    type === "create" ? handleCreate(payload) : handleUpdate(payload);
  };

  useEffect(() => {
    if (createMutation?.isSuccess || updateMutation?.isSuccess) {
      reset();
      setVideoUrl("");
      setProgress("");
      router.push("/templates");
    }
  }, [createMutation?.isSuccess, updateMutation?.isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await http().get(
        `${endpoints.templates.getAll}/${templateId}`,
      );
      console.log({ resp });

      resp && setValue("name", resp?.name);
      resp && setValue("price", resp?.price);
      resp && setValue("sale_price", resp?.sale_price);
      resp && setValue("fields", resp?.fields ?? []);
      resp &&
        resp?.images?.[0] !== null &&
        setValue("images", resp?.images ?? []);
      resp && setVideoUrl(resp?.url);
      resp &&
        setValue(
          "category",
          categories?.find((so) => so.value === resp.category_id),
        );
    };

    if (templateId && (type === "edit" || type === "view")) {
      fetchData();
    }
  }, [templateId, type, categories?.length]);

  const deleteFile = async (file_path, type) => {
    console.log({ file_path, type });
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${file_path}`,
      );
      toast.success(resp.message);
      if (type) {
        return setValue(type, "");
      }
      setVideoUrl("");
      setProgress("");
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        return toast.error(error.message);
      } else {
        toast.error("error deleting image");
      }
    }
  };

  const handleImageRemove = async (id, key) => {
    if (!id) return imagesRemove(key);

    const resp = await http().delete(
      `${endpoints.templates.getAll}/image/${id}`,
    );
    console.log({ resp });
    imagesRemove(key);
  };

  const handleFieldRemove = async (id, key) => {
    if (!id) return remove(key);

    const resp = await http().delete(
      `${endpoints.templates.getAll}/field/${id}`,
    );
    remove(key);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Title
          text={
            type === "create"
              ? "Create template"
              : type === "view"
                ? "Template details"
                : type === "edit"
                  ? "Edit template"
                  : "Are you sure you want to delete"
          }
        />

        <div className="space-y-8">
          {/* template details */}
          <div className="grid grid-cols-3 gap-2">
            {/* category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="category"
                maxMenuHeight={230}
                rules={{ required: "Please select category" }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={categories}
                    placeholder="Select category"
                    isDisabled={type === "view"}
                    className="font-mulish h-[42px] w-full rounded-md bg-[#F7F7FC] text-sm outline-none"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={
                      typeof document !== "undefined" && document.body
                    }
                    menuPosition="absolute"
                  />
                )}
              />

              {errors.category && (
                <span className="text-red-600">{errors.category.message}</span>
              )}
            </div>

            {/* name */}
            <div>
              <Label htmlFor={`name`}>Template name</Label>
              <Input
                disabled={type === "view"}
                {...register(`name`, {
                  required: "This field is required*",
                })}
                placeholder="Enter name"
                type="text"
              />
              {errors.name && (
                <span className="text-red-600">{errors.name.message}</span>
              )}
            </div>

            {/* video */}
            <div>
              <Label htmlFor={`file`}>Video template</Label>
              {isUploading ? (
                <Progress value={progress} />
              ) : videoUrl ? (
                <div className="relative flex items-center justify-around rounded-md border py-[7px]">
                  {type !== "view" && (
                    <div className="absolute -right-4 -top-4">
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => deleteFile(videoUrl)}
                      >
                        <HiTrash size={20} />
                      </Button>
                    </div>
                  )}
                  <div className="w-20">
                    <video
                      controls
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${videoUrl}`}
                    ></video>
                  </div>
                </div>
              ) : (
                <>
                  <Input
                    disabled={type === "view"}
                    {...register(`file`, {
                      required: "This field is required*",
                    })}
                    placeholder="Select video template"
                    type="file"
                    onChange={handleFileChange}
                  />
                  {errors.file && (
                    <span className="text-red-600">{errors.file.message}</span>
                  )}
                </>
              )}
            </div>

            {/* price */}
            <div>
              <Label htmlFor={`price`}>price</Label>
              <Input
                disabled={type === "view"}
                {...register(`price`, {
                  required: "This field is required*",
                })}
                placeholder="Enter price"
                type="text"
              />
              {errors.price && (
                <span className="text-red-600">{errors.price.message}</span>
              )}
            </div>

            {/* sale price */}
            <div>
              <Label htmlFor={`sale_price`}>Sale price</Label>
              <Input
                disabled={type === "view"}
                {...register(`sale_price`, {
                  required: "This field is required*",
                })}
                placeholder="Enter sale price"
                type="text"
              />
              {errors.sale_price && (
                <span className="text-red-600">
                  {errors.sale_price.message}
                </span>
              )}
            </div>
          </div>

          {/* images */}
          <div className="space-y-4">
            <Title text={"Images"} />
            <div className="space-y-4">
              {imagesFields?.[0] !== null &&
                imagesFields?.map((field, key) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <div className="grid w-full grid-cols-2 gap-2">
                      {/* image */}
                      {getValues(`images.${key}.url`) ? (
                        <div className="relative">
                          {type !== "view" && (
                            <div className="absolute -right-1 -top-1 z-10">
                              <Button
                                variant="destructive"
                                type="button"
                                onClick={() =>
                                  deleteFile(
                                    getValues(`images.${key}.url`),
                                    `images.${key}.url`,
                                  )
                                }
                              >
                                <HiTrash size={20} />
                              </Button>
                            </div>
                          )}
                          <Image
                            fill
                            src={`${
                              process.env.NEXT_PUBLIC_IMAGE_DOMAIN
                            }/${getValues(`images.${key}.url`)}`}
                            alt="image"
                            objectFit="cover"
                            objectPosition="center"
                            className="rounded-md"
                          />
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor={`images.${key}.url`}>Image</Label>
                          <Input
                            type="file"
                            {...register("url", {
                              required: "This field is required*",
                            })}
                            onChange={(e) =>
                              handleFileChange(e, `images.${key}.url`)
                            }
                          />
                          {errors?.images?.[key] && (
                            <span className="text-red-600">
                              {errors?.images?.[key]?.["url"]?.message}
                            </span>
                          )}
                        </div>
                      )}
                      {/* page number */}
                      <div>
                        <Label htmlFor={`images.${key}.page_number`}>
                          Page number
                        </Label>
                        <Input
                          disabled={type === "view"}
                          {...register(`images.${key}.page_number`, {
                            required: "This field is required*",
                          })}
                          placeholder="Enter page number"
                          type="text"
                        />
                        {errors?.images?.[key] && (
                          <span className="text-red-600">
                            {errors?.images?.[key]?.["page_number"]?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() =>
                        handleImageRemove(getValues(`images.${key}.id`), key)
                      }
                    >
                      <HiTrash size={20} />
                    </Button>
                  </div>
                ))}
            </div>
            <Button type="button" onClick={() => imagesAppend()}>
              Add fields
            </Button>
          </div>

          {/* fields */}
          <div className="space-y-4">
            <Title text={"Fields"} />
            <div className="space-y-4">
              {fields?.map((field, key) => (
                <div key={field.id} className="flex items-end gap-4">
                  <div className="grid w-full grid-cols-4 gap-2">
                    {/* type */}
                    <div>
                      <Label htmlFor={`fields.${key}.type`}>Type</Label>
                      <Controller
                        name={`fields.${key}.type`}
                        control={control}
                        render={({ field: { onChange } }) => (
                          <Select
                            onValueChange={onChange}
                            required
                            defaultValue={field.type}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    {/* name */}
                    <div>
                      <Label htmlFor={`fields.${key}.name`}>Name</Label>
                      <Input
                        disabled={type === "view"}
                        {...register(`fields.${key}.name`, {
                          required: "This field is required*",
                        })}
                        placeholder="Enter name"
                        type="text"
                      />
                      {errors?.fields?.[key] && (
                        <span className="text-red-600">
                          {errors?.fields?.[key]?.["name"]?.message}
                        </span>
                      )}
                    </div>
                    {/* placeholder */}
                    <div>
                      <Label htmlFor={`fields.${key}.placeholder`}>
                        Placeholder
                      </Label>
                      <Input
                        disabled={type === "view"}
                        {...register(`fields.${key}.placeholder`, {
                          required: "This field is required*",
                        })}
                        placeholder="Enter placeholder"
                        type="text"
                      />
                      {errors?.fields?.[key] && (
                        <span className="text-red-600">
                          {errors?.fields?.[key]?.["placeholder"]?.message}
                        </span>
                      )}
                    </div>
                    {/* page number */}
                    <div>
                      <Label htmlFor={`fields.${key}.page_number`}>
                        Page number
                      </Label>
                      <Input
                        disabled={type === "view"}
                        {...register(`fields.${key}.page_number`, {
                          required: "This field is required*",
                        })}
                        placeholder="Enter page number"
                        type="text"
                      />
                      {errors?.fields?.[key] && (
                        <span className="text-red-600">
                          {errors?.fields?.[key]?.["page_number"]?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() =>
                      handleFieldRemove(getValues(`fields.${key}.id`), key)
                    }
                  >
                    <HiTrash size={20} />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" onClick={() => append()}>
              Add fields
            </Button>
          </div>
        </div>

        {type !== "view" && (
          <div className="text-end">
            <Button variant="primary">
              {createMutation?.isLoading ? (
                <Spinner />
              ) : type === "create" ? (
                "Create"
              ) : type === "edit" ? (
                "Update"
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
