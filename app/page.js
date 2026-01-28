'use client'
// Importing from next/navigation instead of next/router
import { useEffect } from 'react';  // Import useEffect from react
import { useRouter } from 'next/navigation';  // Import useRouter from next/navigation
import Link from 'next/link';
import Slider from 'react-slick';  // Import the carousel slider
import 'slick-carousel/slick/slick.css';  // Carousel styles
import 'slick-carousel/slick/slick-theme.css';  // Carousel theme styles

const HomePage = () => {
  const router = useRouter();  // Initialize useRouter

  // useEffect hook to check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');  // Redirect to login if no token is found
    }
  }, [router]);  // Adding router as a dependency to useEffect

  // Video carousel settings
  const videoCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      {/* Video Carousel Section */}

      {/* Hero Image Section */}
      <div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-5 pt-4 ">
          {/* Video Carousel */}
          <Slider {...videoCarouselSettings}>
          <div className="relative">
            <video
              className="w-full h-[500px] object-cover"
              autoPlay
              loop
              muted
              playsInline
              src="/video1.mp4"  // Replace with your actual video file path
            ></video>
            <div className="absolute bottom-8 left-8  text-3xl font-bold">Special Offer</div>
          </div>
          <div className="relative">
            <video
              className="w-full h-[500px] object-cover"
              autoPlay
              loop
              muted
              playsInline
              src="/video2.mp4"  // Replace with your actual video file path
            ></video>
            <div className="absolute bottom-8 left-8 text-white text-3xl font-bold">Exclusive Discount</div>
          </div>
          <div className="relative">
            <video
              className="w-full h-[500px] object-cover"
              autoPlay
              loop
              muted
              playsInline
              src="/video3.mp4"  // Replace with your actual video file path
            ></video>
            <div className="absolute bottom-8 left-8 text-white text-3xl font-bold">New Arrivals</div>
          </div>
        </Slider>
          <div className="mt-6 pt-5 h-90 w-462" style={{
          backgroundImage: 'url("home3.jpg")',  // Replace with your actual image path
          backgroundSize: 'cover',  // Ensures the background covers the whole section
          backgroundPosition: 'center',  // Centers the background image
          backgroundAttachment: 'fixed', // Makes the background fixed on scroll
        }}>
          <div className="mt-20">
            <h1 className="text-5xl text-black font-semibold">NEW COLLECTION</h1>
            <p className="text-black mt-4 text-xl">Explore the latest styles now.</p>
            <div className="mt-2 flex-row justify-center space-x-4">
            <Link href="/login">
              <span className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition">
                Login
              </span>
            </Link>
          </div>
          </div>
          </div>  
          {/* Navigation Buttons */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;





