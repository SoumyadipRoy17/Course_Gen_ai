import ConfirmChapters from "@/components/ConfirmChapters";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import checkSubscription from "@/lib/subscription";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const CreateChapters = async ({ params }) => {
  console.log("CreateChapters component loaded with params:", params);
  const { courseid } = await params;

  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/gallery");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseid,
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/create");
  }

  return (
    <div className="flex flex-col items-start max-w-xl mx-auto my-16">
      <h5 className="text-sm uppercase text-seconday-foreground/60">
        Course Name
      </h5>
      <h1 className="text-5xl font-bold">{course.name}</h1>

      <div className="flex p-4 mt-5 border-none bg-secondary">
        <Info className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          We generated chapters for each of your units. Look over them and then
          click the Button to confirm and continue
        </div>
      </div>
      <ConfirmChapters course={course} />
    </div>
  );
};

export default CreateChapters;
