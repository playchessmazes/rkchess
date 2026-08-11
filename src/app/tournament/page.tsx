import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy, Calendar, MapPin, Award, CheckCircle2,
  Clock, CreditCard, Utensils, AlertCircle, ShieldCheck
} from "lucide-react";
import RegistrationForm from "@/components/RegistrationForm";
import { getTournamentActiveSetting } from "@/utils/settings";
import styles from "./page.module.css";

export default async function TournamentPage() {
  const isTournamentActive = await getTournamentActiveSetting();

  if (isTournamentActive !== true) {
    return (
      <div className={styles.page}>
        {/* Header Nav */}
        <header className={styles.header}>
          <div className="container">
            <div className={styles.navContent}>
              <Link href="/" className={styles.logoWrapper}>
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
              </Link>

              <nav className={styles.navLinks}>
                <Link href="/">Home</Link>
                <Link href="/#about">About</Link>
                <Link href="/#gallery">Gallery</Link>
                <Link href="/#contact">Contact</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container">
          <div className={styles.closedContainer}>
            <div className={styles.closedIcon}>
              <Trophy size={44} />
            </div>
            <span style={{
              display: "inline-block",
              background: "rgba(225, 29, 72, 0.1)",
              color: "var(--brand-red)",
              fontWeight: 800,
              fontSize: "0.85rem",
              padding: "0.4rem 1.2rem",
              borderRadius: "9999px",
              marginBottom: "1rem",
              letterSpacing: "1px"
            }}>
              🚀 UPCOMING EVENT
            </span>
            <h1 className={styles.closedTitle}>Next Tournament Coming Soon!</h1>
            <p className={styles.closedDesc}>
              RK Chess Academy is preparing for our next Grand Open Chess Tournament. Dates, prize announcements, and online registration will open soon!
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/919700793197"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.homeBtn}
                style={{ background: "#15803d" }}
              >
                WhatsApp for Queries
              </a>
              <Link href="/" className={styles.homeBtn}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* Header Nav */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.navContent}>
            <Link href="/" className={styles.logoWrapper}>
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
            </Link>

            <nav className={styles.navLinks}>
              <Link href="/">Home</Link>
              <Link href="/#about">About</Link>
              <Link href="/#gallery">Gallery</Link>
              <Link href="/#contact">Contact</Link>
              <Link href="/tournament" className={styles.navActive}>Tournament</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>Annual Chess Event</div>
            <h1 className={styles.heroTitle}>
              2nd OPEN CHESS <span className={styles.highlightGold}>TOURNAMENT 2026</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Organized by **RK Chess Academy, Anantapuramu**. Total cash prize pool of **₹32,000** & **64 Trophies**!
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.metaPill}>
                <Calendar size={18} /> AUGUST 23RD 2026 (SUNDAY)
              </div>
              <div className={styles.metaPill}>
                <MapPin size={18} /> ST ANN'S EM SCHOOL, PILLIGUNDLA
              </div>
              <div className={styles.metaPill}>
                <CreditCard size={18} /> ENTRY FEE: ₹500
              </div>
            </div>

            <div className={styles.heroActions}>
              <a href="#register-form" className={styles.heroRegisterBtn}>
                ✍️ REGISTER PLAYER NOW (₹500)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights Stats Bar */}
      <div className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Trophy /></div>
              <div className={styles.statValue}>₹32,000</div>
              <div className={styles.statLabel}>Total Cash Prizes</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><Award /></div>
              <div className={styles.statValue}>64 Trophies</div>
              <div className={styles.statLabel}>For All Category Winners</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><Utensils /></div>
              <div className={styles.statValue}>Free Lunch</div>
              <div className={styles.statLabel}>Provided For All Players</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><CheckCircle2 /></div>
              <div className={styles.statValue}>Certificates</div>
              <div className={styles.statLabel}>For All Participants</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Flyer Info & Registration Form */}
      <main className="container">
        <div className={styles.contentGrid}>

          {/* Left Column: Tournament Details */}
          <div className={styles.detailsCol}>

            {/* GRAND CASH PRIZE HIGHLIGHT BANNER */}
            <div className={styles.prizeBanner}>
              <div className={styles.prizeBannerBadge}>✨ OFFICIAL PRIZE POOL ✨</div>
              <h2 className={styles.prizeBannerTitle}>
                GRAND TOTAL CASH PRIZE: <span className={styles.prizeGoldText}>₹32,000</span>
              </h2>
              <p className={styles.prizeBannerSub}>
                🏆 <strong>64 TROPHIES</strong> FOR ALL WINNERS &bull; 📜 CERTIFICATES FOR ALL PARTICIPANTS &bull; 🍱 FREE LUNCH
              </p>

              <div className={styles.topPrizesRow}>
                <div className={styles.topPrizeBox}>
                  <span className={styles.topPrizeRank}>🥇 1st Rank (Open)</span>
                  <span className={styles.topPrizeAmount}>₹5,000</span>
                  <span className={styles.topPrizeSub}>+ Trophy</span>
                </div>
                <div className={styles.topPrizeBox}>
                  <span className={styles.topPrizeRank}>🥈 2nd Rank (Open)</span>
                  <span className={styles.topPrizeAmount}>₹3,000</span>
                  <span className={styles.topPrizeSub}>+ Trophy</span>
                </div>
                <div className={styles.topPrizeBox}>
                  <span className={styles.topPrizeRank}>🥉 3rd Rank (Open)</span>
                  <span className={styles.topPrizeAmount}>₹2,000</span>
                  <span className={styles.topPrizeSub}>+ Trophy</span>
                </div>
              </div>
            </div>

            {/* Age Categories */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <Trophy size={22} className={styles.cardTitleIcon} />
                Age Categories (Boys & Girls Separate)
              </h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                Players will compete in their respective age category based on birth year rules:
              </p>
              <div className={styles.categoryGrid}>
                <div className={styles.categoryPill}>Under 7</div>
                <div className={styles.categoryPill}>Under 9</div>
                <div className={styles.categoryPill}>Under 11</div>
                <div className={styles.categoryPill}>Under 13</div>
                <div className={styles.categoryPill}>Under 15</div>
                <div className={`${styles.categoryPill} ${styles.categoryOpen}`}>Open Category</div>
              </div>
            </div>

            {/* Open Category Cash Prizes */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <Award size={22} className={styles.cardTitleIcon} />
                Open Category Cash Prizes (Total ₹17,000)
              </h3>
              <div className={styles.tableWrapper}>
                <table className={styles.prizeTable}>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Prize Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>1st Prize</td><td>₹5,000 + Trophy</td></tr>
                    <tr><td>2nd Prize</td><td>₹3,000 + Trophy</td></tr>
                    <tr><td>3rd Prize</td><td>₹2,000 + Trophy</td></tr>
                    <tr><td>4th Prize</td><td>₹1,500 + Trophy</td></tr>
                    <tr><td>5th Prize</td><td>₹1,200 + Trophy</td></tr>
                    <tr><td>6th Prize</td><td>₹1,000 + Trophy</td></tr>
                    <tr><td>7th Prize</td><td>₹900 + Trophy</td></tr>
                    <tr><td>8th Prize</td><td>₹850 + Trophy</td></tr>
                    <tr><td>9th Prize</td><td>₹800 + Trophy</td></tr>
                    <tr><td>10th Prize</td><td>₹750 + Trophy</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Prizes */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <Trophy size={22} className={styles.cardTitleIcon} />
                Age Category Prizes (U7, U9, U11, U13, U15)
              </h3>
              <div className={styles.tableWrapper}>
                <table className={styles.prizeTable}>
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>1st Prize</td><td>₹800 + Trophy</td></tr>
                    <tr><td>2nd Prize</td><td>₹500 + Trophy</td></tr>
                    <tr><td>3rd, 4th & 5th Prizes</td><td>Trophy</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Special Trophies */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <Award size={22} className={styles.cardTitleIcon} />
                Special Trophies (Each ₹500 Prize)
              </h3>
              <div className={styles.specialTrophiesList}>
                <div className={styles.specialItem}>
                  <span>Best St Ann's EM School Best Boy</span>
                  <span className={styles.specialPrice}>₹500 + Trophy</span>
                </div>
                <div className={styles.specialItem}>
                  <span>Best St Ann's EM School Best Girl</span>
                  <span className={styles.specialPrice}>₹500 + Trophy</span>
                </div>
                <div className={styles.specialItem}>
                  <span>Best RK Chess Academy Best Boy</span>
                  <span className={styles.specialPrice}>₹500 + Trophy</span>
                </div>
                <div className={styles.specialItem}>
                  <span>Best RK Chess Academy Best Girl</span>
                  <span className={styles.specialPrice}>₹500 + Trophy</span>
                </div>
              </div>
            </div>

            {/* Important Rules */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <ShieldCheck size={22} className={styles.cardTitleIcon} />
                Important Tournament Rules
              </h3>
              <div className={styles.rulesList}>
                <div className={styles.ruleItem}>
                  <CheckCircle2 size={18} />
                  <span><strong>Equipment:</strong> All players must bring their own Chess Boards / Sets.</span>
                </div>
                <div className={styles.ruleItem}>
                  <Clock size={18} />
                  <span><strong>Schedule:</strong> Reporting Time is 9:00 AM. First Round starts at 10:00 AM.</span>
                </div>
                <div className={styles.ruleItem}>
                  <AlertCircle size={18} />
                  <span><strong>Spot Entry:</strong> Spot entries are strictly NOT allowed. Online registration mandatory.</span>
                </div>
                <div className={styles.ruleItem}>
                  <ShieldCheck size={18} />
                  <span><strong>Fair Play:</strong> Fair play will be strictly enforced. Decisions of the Chief Arbiter are final.</span>
                </div>
                <div className={styles.ruleItem}>
                  <Award size={18} />
                  <span><strong>Special Momento:</strong> Special momento awarded for Academy Coaches who register more than 10 players.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Player Registration Form */}
          <div id="register-form">
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Register for Tournament</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Fill out the player registration form below and upload your UPI payment screenshot (Entry Fee: ₹500).
              </p>
              <RegistrationForm />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "#090e17", color: "white", padding: "2.5rem 0", textAlign: "center", borderTop: "4px solid var(--brand-red)" }}>
        <div className="container">
          <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            &copy; {new Date().getFullYear()} RK Chess Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
