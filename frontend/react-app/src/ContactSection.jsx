import React from "react";
import "./ContactSection.css";

// img
import img1 from "./assets/Contact_img.jpeg";

const ContactSection = () => {
  return (
    <section id="contact" className="contact-wrapper">
      <div className="contact-container">
        {/* --- KOLOM KIRI (GAMBAR REVIEW) --- */}
        <div className="contact-left">
          <div className="image-frame">
            {/* Ganti src dengan gambar review/testimoni kamu */}
            <img src={img1} alt="Contact Me" />
          </div>
        </div>

        {/* --- KOLOM KANAN (TEKS & SOSMED) --- */}
        <div className="contact-right">
          <h2 className="contact-title">
            Masi ga yakin, sama <br />
            <span className="highlight-text">Medivora ?</span>
          </h2>

          <p className="contact-desc">
            Ayo hubungi kami untuk konsultasi serta kendala lainnya.
          </p>

          <div className="social-buttons">
            {/* Tombol Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-btn ig-btn"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png"
                alt="Instagram"
              />
            </a>

            {/* Tombol WhatsApp */}
            <a
              href="https://wa.me/6281255556677"
              target="_blank"
              rel="noreferrer"
              className="social-btn wa-btn"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
                alt="WhatsApp"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
