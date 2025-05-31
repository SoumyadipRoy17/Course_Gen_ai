"use client";

import { cn } from "@/lib/utils";
import axios from "axios";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ChapterCard = React.forwardRef(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const [success, setSuccess] = useState(null);

    const { mutate: getChapterInfo, isLoading } = useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        return response.data;
      },
    });

    const addChapterIdToSet = useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet();
      }
    }, [chapter, addChapterIdToSet]);

    useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }

        getChapterInfo(undefined, {
          onSuccess: () => {
            setSuccess(true);
            addChapterIdToSet();
          },
          onError: (error) => {
            console.error(error);
            setSuccess(false);
            toast({
              title: "Error",
              description: "There was an error loading your chapter",
              variant: "destructive",
            });
            addChapterIdToSet();
          },
        });
      },
    }));

    return (
      <div
        key={chapter.id}
        className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>
          Chapter {chapterIndex + 1} : {chapter.name}
        </h5>
        {isLoading && <Loader2 className="animate-spin" />}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
