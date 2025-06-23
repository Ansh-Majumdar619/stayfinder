/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "../components/BookingForm";
import Chatbot from "../components/Chatbot";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import ListingMap from "../components/ListingMap";
import AutoFitImage from "../components/AutoFitImage"; // Replaces LazyLoadImage
import { useSwipeable } from "react-swipeable";
import ScrambledText from "../ui/ScrambledText";
import FlowingMenu from "../ui/FlowingMenu";





export default function ListingDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [nearbyListings, setNearbyListings] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const baseURL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  // Enable swipe gestures for carousel
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  });


  const demoItems = [
    { link: '#', text: 'Boho Minimal', image: 'https://picsum.photos/600/400?random=1' },
    { link: '#', text: 'Rustic Modern Haven', image: 'https://picsum.photos/600/400?random=2' },
    { link: '#', text: 'Mid‑Century Nest', image: 'https://picsum.photos/600/400?random=3' },
    { link: '#', text: 'Mindful Escape', image: 'https://picsum.photos/600/400?random=4' }
  ];




  // Fetch listing details
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/listings/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching listing:", err);
        setData(null);
      });
  }, [id]);

  // Auto carousel image rotation every 5 seconds
  useEffect(() => {
    if (data?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % data.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [data?.images]);

  // Load nearby listings based on coordinates
  useEffect(() => {
    if (data?.latitude && data?.longitude) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/listings`, {
          params: {
            nearLat: data.latitude,
            nearLng: data.longitude,
            excludeId: id,
          },
        })
        .then((res) => setNearbyListings(res.data))
        .catch((err) => console.error("Error fetching nearby listings:", err));
    }
  }, [data, id]);

  // Wait for all images to preload before animating
  useEffect(() => {
    if (data?.images?.length) {
      let count = 0;
      data.images.forEach((img) => {
        const imgEl = new Image();
        imgEl.src = img.startsWith("http") ? img : `${baseURL}${img}`;
        imgEl.onload = () => {
          count++;
          if (count === data.images.length) setImagesLoaded(true);
        };
      });
    }
  }, [data]);

  // Animate images when they load
  useEffect(() => {
    if (imagesLoaded) {
      gsap.from(".carousel-img", {
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.2,
        ease: "power3.out",
      });
    }
  }, [imagesLoaded]);

  // Navigate to next/previous image
  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % data.images.length);
  };
  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? data.images.length - 1 : prev - 1));
  };

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );

  return (
    <motion.div
      className="p-6 sm:p-10 bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Listing title and location */}
      <div className="flex flex-col items-center justify-center px-4 text-center mt-[-5vh] sm:mt-0">
        <ScrambledText className="scrambled-text-demo text-xl sm:text-xl mb-3 md:text-3xl lg:text-4xl font-bold">
          {data.title}
        </ScrambledText>
        <p className="text-[#e8dcc0] text-md sm:text-lg mt-2 sm:mt-4 italic">📍 {data.location}</p>
      </div>

      {/* Image Carousel */}
      {data.images?.length > 0 && (
        <div className="relative w-full max-w-4xl mx-auto mb-10">
          <div
            {...handlers}
            className="overflow-hidden aspect-video rounded-xl border border-zinc-700 shadow-2xl bg-black flex items-center justify-center"
          >
            <motion.div
              key={currentImage}
              className="carousel-img w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AutoFitImage
                src={data.images[currentImage].startsWith("http") ? data.images[currentImage] : `${baseURL}${data.images[currentImage]}`}
                alt={`Image ${currentImage + 1}`}
              />
            </motion.div>

            {/* Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer bg-black/60 text-white p-2 rounded-full hover:bg-black transition z-10"
            >
              ❮
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-black/60 text-white p-2 rounded-full hover:bg-black transition z-10"
            >
              ❯
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {data.images.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${currentImage === index ? "bg-white scale-125" : "bg-gray-500 opacity-50 hover:opacity-100"
                  }`}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* Price Section */}
      <motion.p className="text-3xl font-semibold text-green-400 text-center mt-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        ₹ {data.price}
      </motion.p>

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10 justify-center">
        {[{ label: "Bedrooms", value: data.bedrooms, icon: "🛏" }, { label: "Beds", value: data.beds, icon: "🛌" }, { label: "Bathrooms", value: data.bathrooms, icon: "🛁" }].map((item, i) => (
          <motion.div key={i} className="bg-zinc-800 hover:scale-105 transform transition-all text-[#e8dcc0] p-4 rounded-xl border border-zinc-700 text-center" whileHover={{ y: -4 }}>
            <p className="text-xl">{item.icon}</p>
            <p className="font-medium">{item.label}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Amenities */}
      {data.amenities?.length > 0 && (
        <div className="mb-10">
          <motion.h3 className="text-xl font-semibold mb-3 text-[#c7b07c]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            Amenities
          </motion.h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm text-[#d5c8ac]">
            {data.amenities.map((item, idx) => (
              <motion.li key={idx} className="bg-zinc-800 px-3 py-1 rounded-md border border-zinc-700" whileHover={{ scale: 1.05 }}>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Description */}
      <motion.p className="text-2xl leading-relaxed mb-10 text-[#d5c8ac]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {data.description}
      </motion.p>

      {/* Host Info */}
      <motion.div className="flex items-center gap-3 bg-zinc-800 text-[#e8dcc0] px-5 py-4 rounded-xl border border-zinc-700 mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="text-2xl">👤</div>
        <div className="text-lg">
          Uploaded by <span className="font-semibold">{data?.host?.name || data?.host?.username || "Unknown"}</span>
        </div>
      </motion.div>

      {/* Booking Form */}
      <motion.div className="mt-10 bg-[#c8a76f] p-6 rounded-xl shadow-lg" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} viewport={{ once: true }}>
        <BookingForm listingId={id} onSuccess={() => alert("Booked!")} />
      </motion.div>


      <div style={{ height: '600px', position: 'relative', marginTop: '20px' }}>
        <FlowingMenu items={demoItems} />
      </div>



      {/* Map */}
      <motion.div className="my-10" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        {data.latitude && data.longitude ? (
          <div className="h-[400px] w-full rounded-xl shadow-lg border border-zinc-700 bg-gradient-to-br from-[#1f1f1f] to-[#2b2b2b] overflow-hidden">
            <ListingMap listing={data} nearbyListings={nearbyListings} />
          </div>
        ) : (
          <div className="h-[400px] w-full flex items-center justify-center text-red-500 border-2 border-red-600 rounded-xl bg-red-50">
            🚫 Map cannot render — missing coordinates
          </div>
        )}
      </motion.div>

      {/* Chatbot */}
      <div className="mt-10">
        <Chatbot />
      </div>
    </motion.div>
  );
}
