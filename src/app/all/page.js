"use client";
import VideoThumbnail from "../../components/VideoThumbnail.js";
import { useFetchTemplates } from "../../hooks/useFetchTemplates.js";
import Link from "next/link";

export default function Page() {
  const { data } = useFetchTemplates();
  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.map(({ id, name, url, price, sale_price }) => (
        <Link href={`/all/${id}`} key={id}>
          <VideoThumbnail src={url} />
          <div className="py-2">
            <h2 className="font-semibold">{name}</h2>
            {sale_price ? (
              <p className="space-x-2">
                <span className="font-semibold">₹{sale_price}</span>
                <span className="text-gray-500 line-through">₹{price}</span>
              </p>
            ) : (
              <p>
                <span className="font-semibold">₹{price}</span>
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
