"use client";

import PackageDetail from "@/student/pages/PackageDetail";
import { useParams } from "next/navigation";
export default function StudentTutorDetailPage() {
  // ID is resolved inside TutorDetailsView via useParams()
  const { id } = useParams();
  return <PackageDetail id={id} />;
}
