import React from "react";
import Image from "next/image";
import {
  MapPin, Phone, Mail, Award, CheckCircle2,
  Users, MonitorPlay, GraduationCap, MessageCircle
} from "lucide-react";

import image1 from "../../assets/image1.webp";
import image2 from "../../assets/image2.webp";
import image3 from "../../assets/image3.webp";
import image4 from "../../assets/image4.webp";
import image5 from "../../assets/image5.webp";
import image6 from "../../assets/image6.webp";
import image7 from "../../assets/image7.webp";
import image8 from "../../assets/image8.webp";
import image9 from "../../assets/image9.webp";
import image10 from "../../assets/image 10.webp";

const galleryImages = [
  image1, image2, image3, image4, image5,
  image6, image7, image8, image9, image10
];

import styles from "./page.module.css";
import { getTournamentActiveSetting } from "@/utils/settings";

export default async function Home() {
  const isTournamentActive = await getTournamentActiveSetting();

  return (
    <div className={styles.page}>

      {/* Navigation Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.navContent}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.jpeg"
                alt="RK Chess Academy Logo"
                width={50}
                height={50}
                className={styles.logoImage}
                priority
                unoptimized
              />
              <span className={styles.logoText}>RK CHESS ACADEMY</span>
            </div>
            <nav className={styles.navLinks}>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#gallery">Gallery</a>
              <a href="#contact">Contact</a>
              {isTournamentActive === true && (
                <a href="/tournament" style={{ color: "var(--brand-red)", fontWeight: 700 }}>
                  Tournament 🏆
                </a>
              )}
            </nav>
            <a href="#contact" className={styles.whatsappBtn}>
              Contact Now
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>Welcome to RK Chess Academy</div>
              <h1 className={styles.heroTitle}>A journey to start learning <span className={styles.highlight}>Chess</span></h1>
              <p className={styles.heroSubtitle}>
                Master the game of kings with expert guidance. We build champions through dedication, strategy, and passion.
              </p>
              <div className={styles.heroActions}>
                <a href="#contact" className={styles.primaryBtn}>Enroll Today</a>
                <a href="#about" className={styles.secondaryBtn}>Learn More</a>
              </div>
            </div>
          </div>
        </section>

        {/* About the Coach Section */}
        <section id="about" className={styles.aboutSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>About the Coach</h2>
              <div className={styles.sectionDivider}></div>
              <p className={styles.sectionSubtitle}>Guiding the next generation of Chess Champions</p>
            </div>
            
            <div className={styles.coachCard}>
              <div className={styles.coachInfo}>
                <span className={styles.coachTag}>FOUNDER & CHIEF COACH</span>
                <h3 className={styles.coachName}>M. Kishore Kumar</h3>
                <p className={styles.coachTitle}>International FIDE Rated Player & Sr. Chess Coach</p>
                
                <p className={styles.coachBio}>
                  With years of dedicated professional chess playing and coaching experience, M. Kishore Kumar has trained hundreds of students from beginners to state and national level competitive players. His strategic methodology focuses on deep tactical vision, endgame mastery, and psychological resilience.
                </p>

                <div className={styles.coachHighlights}>
                  <span><CheckCircle2 size={18} /> Personalized 1-on-1 Tactical Analysis</span>
                  <span><CheckCircle2 size={18} /> FIDE Rating Preparation & Tournament Coaching</span>
                  <span><CheckCircle2 size={18} /> Group Practice & Interactive Sparring</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Why Choose Us</h2>
              <div className={styles.sectionDivider}></div>
              <p className={styles.sectionSubtitle}>We offer comprehensive training programs tailored to your needs.</p>
            </div>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <GraduationCap size={32} />
                </div>
                <h3>One on One Classes</h3>
                <p>Personalized attention focusing on your specific weaknesses and strengths to accelerate your chess journey.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <MonitorPlay size={32} />
                </div>
                <h3>Online Classes</h3>
                <p>Learn from the comfort of your home with our interactive and engaging online chess coaching sessions.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <Users size={32} />
                </div>
                <h3>Group Classes</h3>
                <p>Compete and learn with peers in a collaborative environment that fosters healthy competition and growth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className={styles.gallerySection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Gallery</h2>
              <div className={styles.sectionDivider}></div>
              <p className={styles.sectionSubtitle}>Glimpses of our academy, tournaments, and champions.</p>
            </div>

            <div className={styles.galleryGrid}>
              {galleryImages.map((imgSrc, idx) => (
                <div key={idx} className={styles.galleryItem}>
                  <Image
                    src={imgSrc}
                    alt={`Gallery Image ${idx + 1}`}
                    className={styles.galleryImage}
                    placeholder="blur"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact and Location Section */}
        <section id="contact" className={styles.contactSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Contact & Location</h2>
              <div className={styles.sectionDivider}></div>
            </div>

            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <div className={styles.contactCard}>
                  <h3>Get In Touch</h3>
                  <p>Have questions? We'd love to hear from you. Contact us to start your chess journey.</p>

                  <div className={styles.contactList}>
                    <div className={styles.contactItem}>
                      <div className={styles.contactIcon}><Phone size={20} /></div>
                      <div>
                        <strong>Phone</strong>
                        <p>+91 9700793197<br />+91 9059260464</p>
                      </div>
                    </div>

                    <div className={styles.contactItem}>
                      <div className={styles.contactIcon}><Mail size={20} /></div>
                      <div>
                        <strong>Email</strong>
                        <p>rkchessacadamy@gmail.com</p>
                      </div>
                    </div>

                    <div className={styles.contactItem}>
                      <div className={styles.contactIcon}><MapPin size={20} /></div>
                      <div>
                        <strong>Address</strong>
                        <p>4-1215, near Prasanthi School Line, opp. Beauty Parlour, Ganesha Nagar, Pilligundla, Anantapur, Andhra Pradesh 515004</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.508481688646!2d77.579573!3d14.6838129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14b762384eebd%3A0xedc3e570e0271cb2!2sRK%20CHESS%20ACADEMY!5e0!3m2!1sen!2sin!4v1786379362237!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "350px", borderRadius: "12px" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RK Chess Academy Location Map"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>

            {/* Column 1: Brand & About */}
            <div className={styles.footerCol}>
              <div className={styles.footerLogo}>
                <Image src="/logo.jpeg" alt="Logo" width={48} height={48} unoptimized className={styles.footerLogoImg} />
                <span>RK CHESS ACADEMY</span>
              </div>
              <p className={styles.footerAbout}>
                Dedicated to nurturing young talent and building grandmasters through strategic guidance, passionate coaching, and a structured learning environment.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className={styles.footerCol}>
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#about">About the Coach</a>
              <a href="#gallery">Academy Gallery</a>
              <a href="#contact">Contact Us</a>
            </div>

            {/* Column 3: Contact Info */}
            <div className={styles.footerCol}>
              <h4>Contact Us</h4>
              <div className={styles.footerContactItem}>
                <MapPin size={18} />
                <span>4-1215, near Prasanthi School Line, opp. Beauty Parlour, Ganesha Nagar, Pilligundla, Anantapur - 515004</span>
              </div>
              <div className={styles.footerContactItem}>
                <Phone size={18} />
                <span>+91 97007 93197<br />+91 90592 60464</span>
              </div>
              <div className={styles.footerContactItem}>
                <Mail size={18} />
                <span>rkchessacadamy@gmail.com</span>
              </div>
            </div>
          </div>

          <div className={styles.footerDivider}></div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              &copy; {new Date().getFullYear()} RK Chess Academy. All rights reserved.
            </p>
            <p className={styles.footerDeveloper}>
              Designed for champions.
            </p>
          </div>
        </div>
      </footer>
      {/* Floating Action Buttons (FAB) */}
      <div className={styles.fabContainer}>
        <a href="tel:+919700793197" className={`${styles.fab} ${styles.fabCall}`} aria-label="Call Us" title="Call Us">
          <Phone size={24} />
        </a>
        <a href="https://wa.me/919700793197" target="_blank" rel="noopener noreferrer" className={`${styles.fab} ${styles.fabWhatsapp}`} aria-label="WhatsApp Us" title="WhatsApp Us">
          <MessageCircle size={24} />
        </a>
      </div>
    </div>
  );
}
