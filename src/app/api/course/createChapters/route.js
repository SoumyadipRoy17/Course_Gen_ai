// /api/course/createChapters/route.js

import { NextResponse } from "next/server";

import { createChaptersSchema } from "@/validators/course";
import { strict_output_gemini } from "@/lib/gpt";
import { ZodError } from "zod";
import { getUnsplashImage } from "@/lib/unsplash";
import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import checkSubscription from "@/lib/subscription";

export async function POST(request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPro = await checkSubscription();
    if (session.user.credits <= 0 && !isPro) {
      return new NextResponse("no credits", { status: 402 });
    }

    const body = await request.json();
    const { title, units } = createChaptersSchema.parse(body);

    const output_units = await strict_output_gemini(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter",
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`
      ),
      {
        title: "title of the unit",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",
      }
    );

    const imageSearchTerm = await strict_output_gemini(
      "you are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results`,
      {
        image_search_term: "a good search term for the title of the course",
      }
    );

    const course_image = await getUnsplashImage(
      imageSearchTerm.image_search_term
    );

    //console.log("Output units:", output_units, imageSearchTerm, course_image);

    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
      },
    });
    for (const unit of output_units) {
      const prismaUnit = await prisma.unit.create({
        data: {
          name: unit.title,
          courseId: course.id,
        },
      });

      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => ({
          name: chapter.chapter_title,
          youtubeSearchQuery: chapter.youtube_search_query,
          unitId: prismaUnit.id,
        })),
      });
    }
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });
    return NextResponse.json(
      {
        course_id: course.id,
      },
      { status: 201 }
    );
  } catch (error) {
    // return NextResponse.json({ error }, { status: 400 });
    console.error("Detailed Prisma Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
