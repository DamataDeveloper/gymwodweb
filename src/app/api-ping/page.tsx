"use client";
import { useEffect, useState } from "react";

export default function ApiPing() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const url =
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/health";
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);
  return <pre className="p-4">{JSON.stringify(data, null, 2)}</pre>;
}
