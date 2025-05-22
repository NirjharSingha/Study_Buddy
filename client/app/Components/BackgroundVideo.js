"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Welcome() {
  const bgRef = useRef(null);
  const canvasRef = useRef(null);

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (bgRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPos = (clientX / innerWidth - 0.5) * 30;
        const yPos = (clientY / innerHeight - 0.5) * 30;
        bgRef.current.style.transform = `translate(${xPos}px, ${yPos}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[120vh] flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Backgrounds */}
      <div className="absolute inset-0 bg-animated-gradient"></div>
      <div className="absolute inset-0 bg-animated-radial opacity-50"></div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-20 pointer-events-none"
      />

      {/* Pattern Overlay with Parallax and Animation */}
      <div
        ref={bgRef}
        className="absolute inset-0 opacity-20 transition-transform duration-150"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.5'%3E%3Cpath d='M0 0h25v25H0zm25 25h25v25H25zm25-25h25v25H50zM25 50h25v25H25zm-25 25h25v25H0zm50 0h25v25H50zM0 50h25v25H0zm75-25h25v25H75zm-25-25h25v25H50z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
          animation: "pulse-drift 25s linear infinite",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-32 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
              Unlock Your Potential
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto animate-fade-in-up">
            Discover interactive courses, expert mentors, and a community of
            learners to help you achieve your educational goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/resources"
              className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg animate-bounce-slow"
            >
              Explore Resources
            </Link>
            <Link
              href="/auth"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all transform hover:scale-105 animate-pulse-slow"
            >
              Join for Free
            </Link>
          </div>
          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard finalNumber="10K+" label="Active Learners" />
            <StatCard finalNumber="200+" label="Expert Instructors" />
            <StatCard finalNumber="500+" label="Courses Available" />
            <StatCard finalNumber="24/7" label="Learning Support" />
          </div>
        </div>
      </div>

      {/* Scrolling Indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white mt-2 rounded-full animate-scroll"></div>
        </div>
      </div>

      {/* Styles for Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes radial {
          0% {
            background-position: 50% 0%;
          }
          50% {
            background-position: 50% 100%;
          }
          100% {
            background-position: 50% 0%;
          }
        }
        @keyframes pulse-drift {
          0% {
            background-position: 0 0;
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
          100% {
            background-position: 100px 100px;
            opacity: 0.15;
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }
        .bg-animated-gradient {
          background: linear-gradient(
            45deg,
            #1e3a8a,
            #4c1d95,
            #7f1d1d,
            #713f12
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        .bg-animated-radial {
          background: radial-gradient(circle at center, #ffffff33, transparent);
          background-size: 200% 200%;
          animation: radial 20s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

function StatCard({ finalNumber, label }) {
  const [displayNumber, setDisplayNumber] = useState("0");
  const letters = "0123456789";

  useEffect(() => {
    let iteration = 0;
    const intervalDuration = 30;
    const totalIterations = 15;

    const interval = setInterval(() => {
      setDisplayNumber((prev) => {
        if (iteration >= totalIterations) {
          clearInterval(interval);
          return finalNumber;
        }

        iteration += 1;

        if (/\D/.test(finalNumber)) {
          const numericPart = finalNumber.replace(/\D/g, "");
          const symbolPart = finalNumber.replace(/\d/g, "");

          return (
            numericPart
              .split("")
              .map((_, i) => {
                if (i < iteration / (totalIterations / numericPart.length)) {
                  return numericPart[i];
                }
                return letters[Math.floor(Math.random() * 10)];
              })
              .join("") + symbolPart
          );
        }

        return finalNumber
          .split("")
          .map((_, i) => {
            if (i < iteration / (totalIterations / finalNumber.length)) {
              return finalNumber[i];
            }
            return letters[Math.floor(Math.random() * 10)];
          })
          .join("");
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [finalNumber]);

  return (
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:scale-105 transition-transform">
      <p className="text-2xl md:text-3xl font-bold text-white">
        {displayNumber}
      </p>
      <p className="text-sm md:text-base text-white/80">{label}</p>
    </div>
  );
}
