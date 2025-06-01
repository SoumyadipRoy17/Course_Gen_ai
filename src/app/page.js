"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const images = ["/ai1.jpg", "/ai2.jpg", "/ai3.jpg", "/ai4.jpg", "/ai5.jpg"];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-6 text-white">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
          AI Course Generator
        </h1>
        <p className="text-lg mb-8 text-indigo-200 max-w-xl mx-auto">
          Generate customized courses on any topic with the help of AI tailored
          just for you. Explore, learn, and master the latest in artificial
          intelligence with ease.
        </p>

        <Button
          size="lg"
          onClick={() => router.push("/gallery")}
          className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg"
        >
          View Course Gallery
        </Button>
      </div>

      {/* Auto-scrolling image carousel */}
      <div className="overflow-hidden w-full max-w-5xl mt-12">
        <div className="flex animate-scroll whitespace-nowrap space-x-8">
          {[...images, ...images].map((src, index) => (
            <Image
              key={index}
              src={src}
              width={300}
              height={200}
              alt={`AI example ${index + 1}`}
              className="h-48 w-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </main>
  );
}
