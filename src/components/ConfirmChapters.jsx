"use client";
import React, { useMemo, useRef, useState } from "react";
import ChapterCard from "./ChapterCard";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ConfirmChapters = ({ course }) => {
  const [loading, setLoading] = useState(false);
  const chapterRefs = {};

  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      chapterRefs[chapter.id] = useRef(null);
    });
  });

  const [completedChapters, setCompletedChapters] = useState(new Set());

  const totalChaptersCount = useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  console.log(totalChaptersCount, completedChapters.size);

  return (
    <div className="w-full mt-4">
      {course.units.map((unit, unitIndex) => (
        <div key={unit.id} className="mt-5">
          <h2 className="text-sm uppercase text-secondary-foreground/60">
            Unit {unitIndex + 1}
          </h2>
          <h3 className="text-2xl font-bold">{unit.name}</h3>
          <div className="mt-3">
            {unit.chapters.map((chapter, chapterIndex) => (
              <ChapterCard
                completedChapters={completedChapters}
                setCompletedChapters={setCompletedChapters}
                ref={chapterRefs[chapter.id]}
                key={chapter.id}
                chapter={chapter}
                chapterIndex={chapterIndex}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center mt-4">
        <Separator className="flex-[1]" />
        <div className="flex items-center mx-4">
          <Link
            href="/create"
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={4} />
            Back
          </Link>
          {totalChaptersCount === completedChapters.size ? (
            <Link
              className={buttonVariants({
                className: "ml-4 font-semibold",
              })}
              href={`/course/${course.id}/0/0`}
            >
              Save & Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <Button
              type="button"
              className="ml-4 font-semibold"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                Object.values(chapterRefs).forEach((ref) => {
                  ref.current?.triggerLoad();
                });
              }}
            >
              Generate
              <ChevronRight className="w-4 h-4 ml-2" strokeWidth={4} />
            </Button>
          )}
        </div>
        <Separator className="flex-[1]" />
      </div>
    </div>
  );
};

export default ConfirmChapters;
