import React, { useState, useEffect } from "react";
import "./LandingPage.css";
import GlassIcons from "./component/GlassIcons";
import { FiBook } from "react-icons/fi";

// Import Components
import ColorBends from "./component/ColorBends";
import LiquidGlass from "./component/LiquidGlass";
import PillNav from "./component/PillNav";
import TextType from "./component/TextType";
import ProfileCard from "./component/ProfileCard";
import ScrollFloat from "./component/ScrollFloat";

// Import Sections
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";

// import icon
import Logo from "../public/LogoMedivora.PNG";

// import Team
import nara from "./assets/img_nara1.png";
import abay from "./assets/img_abay.png";
import satrio from "./assets/img_satrio.png";
import jaya from "./assets/img_jaya.png";
import anna from "./assets/img_anna.jpg";

// 🔥 1. AMBIL PROP onGetStarted DI SINI
const LandingPage = ({ onGetStarted }) => {
  // State untuk active link
  const [activeLink, setActiveLink] = useState("#home");

  // Data Navigasi
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  // Data Glass Icons
  const glassitem = [
    {
      icon: <FiBook color="white" size={24} />,
      color: "purple",
      label: "Books",
      href: "https://drive.google.com/file/d/1V9tqkAQrQ4jiGV0-5CjPITD8AknRM4uA/view?usp=drive_link",
    },
  ];

  // 🔥 DATA TIM CREATOR (4 ORANG)
  const teamMembers = [
    {
      name: "Anna",
      role: "HKI",
      desc: "Preparing a Intellectual Property Rights",
      img: anna,
      link: "https://www.instagram.com/nnamirayunita_/",
      handle: "nnamirayunita_",
    },
    {
      name: "Narendra",
      role: "Full Stack Developer",
      desc: "Developing the core intelligence, Ui and Database",
      img: nara,
      link: "https://www.instagram.com/shinara_404_/",
      handle: "shinara_404_",
    },
    {
      name: "Akbar",
      role: "Designer",
      desc: "Crafting beautiful interfaces.",
      img: abay,
      link: "https://www.instagram.com/tamiokamishoo/",
      handle: "tamiokamisho",
    },
    {
      name: "Jaya",
      role: "Documentation",
      desc: "Designing Use Case",
      img: jaya,
      link: "https://www.instagram.com/jaya_yuonky47/",
      handle: "jaya_yuonky47",
    },
  ];

  // 🔥 LOGIC SCROLL SPY (AUTO ACTIVE NAVBAR) 🔥
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3, // Aktif jika 30% section terlihat
    };

    // 2. Fungsi Callback saat scroll
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Set active link sesuai ID section yang terlihat
          setActiveLink(`#${entry.target.id}`);
        }
      });
    };

    // 3. Buat Observer
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // 4. Targetkan section berdasarkan ID
    const sections = document.querySelectorAll("section[id], div[id]");
    sections.forEach((section) => {
      // Hanya observe ID yang ada di navbar (home, about, contact)
      if (["home", "about", "contact"].includes(section.id)) {
        observer.observe(section);
      }
    });

    // 5. Cleanup saat component di-unmount
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="landing-wrapper">
      {/* --- LAYER 1: BACKGROUND  --- */}
      <div className="landing-bg-layer">
        <ColorBends />
        <div className="landing-overlay"></div>
      </div>

      {/* --- LAYER 2: NAVBAR  --- */}
      <div className="landing-navbar">
        <PillNav
          items={navItems}
          activeHref={activeLink}
          baseColor="rgba(255, 255, 255, 0.1)"
          pillColor="#ffffff"
          pillTextColor="#ffffff"
          hoveredPillTextColor="#000000"
          className="custom-pill-nav"
          onItemClick={(href) => setActiveLink(href)}
        />
      </div>

      {/* --- LAYER 3: CONTENT UTAMA (Global) --- */}
      {/* 1. GLASS ICONS (Kanan Bawah) */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "60px",
          zIndex: 100,
        }}
      >
        <GlassIcons
          items={glassitem}
          style={{ width: "auto", margin: 0, transform: "scale(0.9)" }}
        />
      </div>

      {/* === HERO / HOME === */}
      <div id="home" className="landing-content">
        <img
          src="/LogoMedivora.PNG"
          alt="Medivora Logo"
          className="landing-logo"
        />

        <h1 className="landing-title">
          <TextType
            text={["MEDIVORA AI"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </h1>

        <p className="landing-desc">
          Asisten medis cerdas berbasis AI untuk deteksi dini dan informasi
          kanker terpercaya. Akurat, Cepat, dan Berbasis Jurnal Medis.
        </p>

        {/* 2. 🔥 PASANG PROP onGetStarted KE TOMBOL */}
        <LiquidGlass onClick={onGetStarted}>Mulai Sekarang</LiquidGlass>
      </div>

      {/* === ABOUT SECTION === */}
      <AboutSection />

      {/* === CONTACT SECTION === */}
      <ContactSection />

      {/* === 🔥 CREATOR SECTION (New) 🔥 === */}
      <section id="creators" className="creator-wrapper">
        <h2 className="creator-title">
          <ScrollFloat
            animationDuration={4}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            Team Creator
          </ScrollFloat>
        </h2>

        <div className="creator-grid">
          {teamMembers.map((member, index) => (
            /* Bungkus ProfileCard agar styling grid bekerja */
            <div key={index} className="creator-card-item">
              <ProfileCard
                name={member.name}
                title={member.role}
                description={member.desc}
                avatarUrl={member.img}
                handle={member.handle}
                contactUrl={member.link}

                // Sesuaikan props ini dengan props asli ProfileCard kamu
              />
            </div>
          ))}
        </div>
      </section>

      {/* === FOOTER === */}
      <div
        className="landing-footer"
        style={{ backgroundColor: "#004e29", border: "none" }}
      >
        &copy; 2025 Medivora Project. All Rights Reserved.
      </div>
    </div>
  );
};

export default LandingPage;
