"use client";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function FieldForm() {
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
          name: "",
          placeholder: "",
          url: "",
          price: "",
          sale_price: "",
          page_number: "",
          template_id: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  return (
    <div className="bg-white p-8 rounded-lg space-y-4">
      <div className="space-y-8">
        {fields?.map((field, key) => (
          <div key={field.id} className="grid grid-cols-3 gap-2 border-b pb-8 ">
            {/* type */}
            <div>
              <Label htmlFor={`fields.${key}.type`}>Type</Label>
              <Input
                {...register(`fields.${key}.type`)}
                placeholder="Enter type"
              />
            </div>
            {/* name */}
            <div>
              <Label htmlFor={`fields.${key}.name`}>Name</Label>
              <Input
                {...register(`fields.${key}.name`)}
                placeholder="Enter name"
              />
            </div>
            {/* placeholder */}
            <div>
              <Label htmlFor={`fields.${key}.placeholder`}>placeholder</Label>
              <Input
                {...register(`fields.${key}.placeholder`)}
                placeholder="Enter placeholder"
              />
            </div>
            {/* url */}
            <div>
              <Label htmlFor={`fields.${key}.url`}>url</Label>
              <Input
                {...register(`fields.${key}.url`)}
                placeholder="Enter url"
              />
            </div>
            {/* price */}
            <div>
              <Label htmlFor={`fields.${key}.price`}>price</Label>
              <Input
                {...register(`fields.${key}.price`)}
                placeholder="Enter price"
              />
            </div>
            {/* sale price */}
            <div>
              <Label htmlFor={`fields.${key}.sale_price`}>Sale price</Label>
              <Input
                {...register(`fields.${key}.sale_price`)}
                placeholder="Enter sale price"
              />
            </div>
            {/* page number */}
            <div>
              <Label htmlFor={`fields.${key}.page_number`}>Page number</Label>
              <Input
                {...register(`fields.${key}.page_number`)}
                placeholder="Enter sale price"
              />
            </div>
            {/* template id */}
            <div>
              <Label htmlFor={`fields.${key}.template_id`}>Template Id</Label>
              <Input
                {...register(`fields.${key}.template_id`)}
                placeholder="Enter sale price"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-end">
        <Button type="button" onClick={() => append()}>
          Add
        </Button>
      </div>
    </div>
  );
}
