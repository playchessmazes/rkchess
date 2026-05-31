import React from "react";
import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";
import {
  Calendar, MapPin, Trophy, Phone,
  Clock, CreditCard, Award, HelpCircle, ShieldCheck
} from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Top Banner / Announcement */}
      <div className={styles.topAnnounce}>
        <div className="container">
          <span>🚨 Registration Deadline: <strong>6th June 2026</strong></span>
        </div>
      </div>

      {/* Main Header with Official Logo */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.branding}>
              {/* Circular Logo - support public/logo.png or fallback styled SVG */}
              <div className={styles.logoWrapper}>
                <Image
                  src="/logo.jpeg"
                  alt="RK Chess Academy Logo"
                  width={100}
                  height={100}
                  className={styles.logoImage}
                  priority
                  unoptimized // avoid image optimization issues with local files
                />
              </div>
              <div className={styles.logoTexts}>
                <h1 className={styles.logoTitle}>RK CHESS ACADEMY</h1>
                <p className={styles.logoLocation}>ANANTAPURAMU</p>
                <div className={styles.coachBadge}>Sr. Coach: M. Kishore Kumar</div>
              </div>
            </div>

            <div className={styles.headerAction}>
              <a href="https://wa.me/919700793197" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.031 6c-3.308 0-6 2.692-6 6 0 1.258.396 2.428 1.072 3.4L6 20l4.744-1.008c.956.552 2.064.888 3.284.888 3.308 0 6-2.692 6-6 0-3.308-2.692-6-6-6zm0 1c2.757 0 5 2.243 5 5s-2.243 5-5 5c-1.042 0-2-.323-2.8-.88l-.2-.14-.7.15-.1.02.16-.69-.11-.2c-.524-.766-.81-1.666-.81-2.6 0-2.757 2.243-5 5-5zm-1.85 2.2c-.173 0-.361.042-.519.208-.158.167-.611.597-.611 1.458s.627 1.694.715 1.812c.088.118 1.233 1.883 2.99 2.64.417.18.743.287.997.367.419.133.8.114 1.101.07.337-.05 1.039-.425 1.186-.834.147-.409.147-.759.103-.834-.044-.075-.162-.118-.339-.208s-1.039-.513-1.2-.572c-.162-.058-.28-.088-.398.088-.118.175-.456.572-.559.688-.103.118-.206.133-.383.044-.177-.088-.747-.275-1.424-.878-.527-.47-882-.788-.985-.964-.103-.176-.01-.271.078-.36.08-.08.177-.208.265-.313.088-.104.118-.175.177-.292.059-.118.03-.22-.015-.31-.044-.088-.398-.958-.545-1.313-.143-.347-.3-.299-.41-.305-.104-.005-.224-.005-.343-.005z" />
                </svg>
                WhatsApp for Queries: 97007 93197
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>Annual Chess Event</div>
          <h2 className={styles.heroTitle}>SUMMER OPEN CHESS TOURNAMENT</h2>
          <div className={styles.heroDivider}></div>
          <p className={styles.heroSubtitle}>
            Organized by **RK Chess Academy, Anantapuramu**. Join us for an exciting day of intellectual battle.
            Bring your own chess boards and compete for prestigious trophies!
          </p>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <main className={styles.main}>
        <div className="container">
          <div className={styles.contentGrid}>

            {/* Column 1: Informational details representing the flyer exactly */}
            <aside className={styles.infoColumn}>

              {/* Core Event Stats */}
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}><Calendar /></div>
                  <div className={styles.statLabel}>Tournament Date</div>
                  <div className={styles.statValue}>07-06-2026</div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon}><CreditCard /></div>
                  <div className={styles.statLabel}>Entry Fee</div>
                  <div className={styles.statValue}>₹300</div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon}><Clock /></div>
                  <div className={styles.statLabel}>First Round</div>
                  <div className={styles.statValue}>09:30 AM</div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon}><Trophy /></div>
                  <div className={styles.statLabel}>Total Trophies</div>
                  <div className={styles.statValue}>33 Trophies</div>
                </div>
              </div>

              {/* Tournament Details Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>
                  <Award size={20} className={styles.cardTitleIcon} />
                  Tournament Highlights
                </h3>

                <div className={styles.highlightSection}>
                  <h4 className={styles.highlightGroupTitle}>Tournament Categories</h4>
                  <div className={styles.categoryPills}>
                    <span className={styles.categoryPill}>Under 7</span>
                    <span className={styles.categoryPill}>Under 9</span>
                    <span className={styles.categoryPill}>Under 11</span>
                    <span className={styles.categoryPill}>Under 13</span>
                    <span className={styles.categoryPill}>Under 15</span>
                    <span className={`${styles.categoryPill} ${styles.openCategoryPill}`}>Open Category</span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoRowIcon}><Trophy size={16} /></div>
                  <div className={styles.infoRowText}>
                    <strong>Trophies & Awards:</strong> Top 3 Trophies in each age category and the Open Category (Total 33 Trophies). Every participant receives a <strong>Certificate and Medal</strong>!
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoRowIcon}><ShieldCheck size={16} /></div>
                  <div className={styles.infoRowText}>
                    <strong>Campus:</strong> Fully Air-Conditioned <strong>(AC Campus)</strong>.
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoRowIcon}><HelpCircle size={16} /></div>
                  <div className={styles.infoRowText}>
                    <strong>Equipment Notice:</strong> Players must bring their own Chess Boards.
                  </div>
                </div>
              </div>

              {/* Venue Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>
                  <MapPin size={20} className={styles.cardTitleIcon} />
                  Venue Location
                </h3>
                <p className={styles.venueAddress}>
                  <strong>AFFLATUS GLOBAL SCHOOL</strong><br />
                  Behind MGB Mobiles, NH-44,<br />
                  Bangalore Highway, Anantapur.
                </p>
                <div className={styles.mapAlert}>
                  📍 Conveniently located on the Bangalore Highway with ample parking.
                </div>
              </div>

              {/* Contact Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>
                  <Phone size={20} className={styles.cardTitleIcon} />
                  Queries & Contact
                </h3>
                <p className={styles.supportText}>
                  Online registration is mandatory using the form. For support and query clarifications, contact our Head Coach:
                </p>
                <div className={styles.coachContactBox}>
                  <strong>M. KISHORE KUMAR</strong>
                  <span className={styles.coachSub}>International FIDE Rated Chess Player & Sr. Chess Coach</span>
                  <a href="tel:+919700793197" className={styles.phoneLink}>
                    📞 97007 93197
                  </a>
                </div>
              </div>

            </aside>

            {/* Column 2: Player Registration Form */}
            <section className={styles.formSection}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>Register for Summer Open</h3>
                <p className={styles.formCardSubtitle}>
                  Online registration is mandatory. Entry fee of ₹300 is to be paid at the venue.
                </p>
              </div>
              <RegistrationForm />
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <p className={styles.footerCopyright}>&copy; {new Date().getFullYear()} RK Chess Academy Anantapuramu. All rights reserved.</p>
            {/* <p className={styles.footerDeveloper}>Website created & maintained by <strong>chessmazes</strong></p> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
