"use client";
import { useParams } from "next/navigation";
import ProfilePage from "@/tutor/ProfilePage";

export default function TutorProfilePage() {
  const { id } = useParams();
  return <ProfilePage id={id} />;
}
