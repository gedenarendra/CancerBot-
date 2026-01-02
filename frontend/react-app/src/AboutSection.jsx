import React, { Suspense, useEffect, useRef, useState } from "react";
import SpotlightCard from "./component/SpotlightCard";
import "./AboutSection.css";

import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Float,
  useAnimations,
} from "@react-three/drei";

// gambar
import img1 from "./assets/card_img1.jpeg";
import img2 from "./assets/card_img2.jpeg";
import img3 from "./assets/card_img3.jpeg";

// --- 3D MODEL COMPONENT (TIDAK BERUBAH) ---
const DoctorModel = () => {
  const group = useRef();
  const { scene, animations } = useGLTF("/Doctor.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (animations.length > 0) {
      const firstAnim = Object.keys(actions)[0];
      actions[firstAnim]?.reset().fadeIn(0.5).play();
    }
  }, [actions, animations]);

  return (
    <group ref={group} dispose={null}>
      <primitive
        object={scene}
        scale={1.4}
        position={[0, 1.5, 0]}
        rotation={[0, -0.4, 0]}
      />
    </group>
  );
};

// --- KOMPONEN KARTU FLIP BARU ---
const FlipCardItem = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flip-card-wrapper ${isFlipped ? "flipped" : ""}`}>
      <div className="flip-card-inner">
        {/* --- BAGIAN DEPAN (FRONT) --- */}
        <div className="flip-card-face flip-card-front">
          <SpotlightCard className="custom-card full-height">
            <div className="card-image-wrapper">
              <img src={card.img} alt={card.title} />
            </div>
            <div className="card-content-front">
              <h3>{card.title}</h3>
              {/* Tombol untuk memutar kartu */}
              <button className="btn-flip" onClick={handleFlip}>
                Lihat Penjelasan &rarr;
              </button>
            </div>
          </SpotlightCard>
        </div>

        {/* --- BAGIAN BELAKANG (BACK) --- */}
        <div className="flip-card-face flip-card-back">
          <SpotlightCard className="custom-card full-height">
            <div className="card-content-back">
              <h3>{card.title}</h3>
              <div className="desc-scroll">
                <p>{card.desc}</p>
                {/* Jika ada link panduan khusus */}
                {card.href && (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-guide"
                  >
                    Download Panduan
                  </a>
                )}
              </div>
              {/* Tombol Balik ke Semula */}
              <button className="btn-flip-back" onClick={handleFlip}>
                &larr; Kembali
              </button>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
const AboutSection = () => {
  const cards = [
    {
      title: "Tujuan medivora",
      desc: "Memberikan akses informasi kesehatan yang mudah dan akurat bagi pasien kanker, membantu mereka memahami kondisi tubuh secara lebih tenang sebelum bertemu dokter.",
      img: img1,
    },
    {
      title: "Manfaat medivora",
      desc: "Dapatkan dukungan kesehatan 24/7 dengan Medivora AI: akses instan ke info gejala, panduan gaya hidup sehat, dan edukasi medis sederhana untuk ketenangan pikiran Anda.",
      img: img2,
    },
    {
      title: "Panduan",
      desc: "Menyediakan akses informasi kanker yang akurat untuk mengurangi kekhawatiran masyarakat.",
      img: img3,
      href: "https://drive.google.com/file/d/1V9tqkAQrQ4jiGV0-5CjPITD8AknRM4uA/view?usp=drive_link",
    },
  ];

  return (
    <section id="about" className="about-wrapper">
      <div className="about-container">
        {/* KOLOM KIRI */}
        <div className="about-left">
          <h2 className="about-title">Teman Pintar Melawan Kanker</h2>
          <p className="about-desc">
            Medivora AI adalah asisten cerdas berbasis AI yang berfokus pada
            edukasi kanker. Kami menyediakan informasi akurat seputar
            pencegahan, deteksi dini, dan gejala selama 24/7 untuk membantu Anda
            mengambil langkah tepat demi masa depan yang lebih sehat.
          </p>

          <div className="about-cards-grid">
            {cards.map((card, index) => (
              // Panggil komponen FlipCardItem di sini
              <FlipCardItem key={index} card={card} />
            ))}
          </div>
        </div>

        {/* KOLOM KANAN (3D) */}
        <div className="about-right">
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <DoctorModel />
              </Float>
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </div>
    </section>
  );
};

useGLTF.preload("/Doctor.glb");

export default AboutSection;
