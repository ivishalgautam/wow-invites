"use client";
import React from "react";
import TemplateForm from "@/components/Forms/Template";

export default function Page({ params: { id } }) {
  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <TemplateForm type={"view"} templateId={id} />
    </div>
  );
}
