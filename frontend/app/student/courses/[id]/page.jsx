"use client";

import CourseDetails from "@/student/pages/CourseDetails";

export default function StudentCourseDetailPage({ params }) {
  return <CourseDetails courseId={params.id} />;
}
