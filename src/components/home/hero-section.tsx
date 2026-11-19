
"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    eyebrow: "WELCOME TO BOOKNOOK",
    title: "Discover Your Next Favourite Book",
    description:
      "Explore a world of stories, knowledge, and imagination. Find the perfect book for your next reading adventure.",
    image: "/images/hero/slide-1.png",
    alt: "A cozy reading space with open books",
  },
  {
    id: 2,
    eyebrow: "EXPLORE OUR COLLECTION",
    title: "Every Book Opens a New World",
    description:
      "Browse through different categories and discover books that inspire, educate, and entertain.",
    image: "/images/hero/slide-2.png",
    alt: "A collection of books in a library",
  },
  {
    id: 3,
    eyebrow: "READ. LEARN. GROW.",
    title: "Make Reading Part of Your Life",
    description:
      "Find your favourite reads and enjoy a simple way to discover and borrow books from BookNook.",
    image: "/images/hero/slide-3.png",
    alt: "A student reading a book",
  },
];

function HeroCarousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop
      spaceBetween={30}
      slidesPerView={1}
      className="booknook-hero-swiper"
    >
      {heroSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="grid min-h-[420px] items-center gap-10 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10 lg:p-14">
            {/* Hero Content */}
            <div className="flex flex-col items-start">
              <span className="mb-4 rounded-full bg-green-100 px-4 py-2 text-xs font-semibold tracking-wider text-green-800">
                {slide.eyebrow}
              </span>

              <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                {slide.description}
              </p>

              <Link
                href="/books"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
              >
                Browse Books
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative h-[260px] overflow-hidden rounded-xl sm:h-[320px] md:h-[350px]">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={slide.id === 1}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-green-50/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Suspense
          fallback={
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-white">
              <p className="text-sm text-slate-500">
                Loading featured books...
              </p>
            </div>
          }
        >
          <HeroCarousel />
        </Suspense>
      </div>

      {/* Swiper Custom Styling */}
      <style jsx global>{`
        .booknook-hero-swiper {
          padding-bottom: 45px;
        }

        .booknook-hero-swiper .swiper-button-next,
        .booknook-hero-swiper .swiper-button-prev {
          color: #15803d;
        }

        .booknook-hero-swiper .swiper-pagination-bullet-active {
          background: #15803d;
        }
      `}</style>
    </section>
  );
}
