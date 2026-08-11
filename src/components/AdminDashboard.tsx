"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowLeft,
  Download,
  ExternalLink,
  X,
  Trophy,
  Users,
  CreditCard,
  Calendar,
  AlertTriangle,
  LogOut,
  Trash2
} from "lucide-react";
import Link from "next/link";
import styles from "./AdminDashboard.module.css";

interface Registration {
  id: string;
  created_at: string;
  full_name: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string | null;
  fide_id: string | null;
  fide_rating: number | null;
  category: string;
  academy_name: string | null;
  club?: string | null;
  city_state: string;
  screenshot_url: string;
}

interface AdminDashboardProps {
  initialData: Registration[];
  error?: string;
  onLogout?: () => void;
}

export default function AdminDashboard({ initialData, error, onLogout }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ url: string; name: string } | null>(null);
  const [isTournamentActive, setIsTournamentActive] = useState<boolean>(true);
  const [isUpdatingSetting, setIsUpdatingSetting] = useState<boolean>(false);

  // Fetch initial tournament setting
  React.useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.isTournamentActive === "boolean") {
          setIsTournamentActive(data.isTournamentActive);
        }
      })
      .catch((err) => console.error("Failed to load setting:", err));
  }, []);

  // Toggle tournament setting
  const toggleTournamentSetting = async () => {
    setIsUpdatingSetting(true);
    const nextState = !isTournamentActive;
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTournamentActive: nextState }),
      });
      if (res.ok) {
        setIsTournamentActive(nextState);
      }
    } catch (err) {
      console.error("Failed updating setting:", err);
    } finally {
      setIsUpdatingSetting(false);
    }
  };

  // Category labels mapping
  const categoryLabels: { [key: string]: string } = {
    u7: "Under 7",
    u9: "Under 9",
    u11: "Under 11",
    u13: "Under 13",
    u15: "Under 15",
    open: "Open (All Ages)",
  };

  // Filter registrations in real-time
  const filteredData = initialData.filter((r) => {
    const nameMatch = (r.full_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (r.mobile || "").includes(searchTerm);
    const idMatch = (r.id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const clubMatch = ((r.club || r.academy_name) || "").toLowerCase().includes(searchTerm.toLowerCase());
    const textMatch = nameMatch || phoneMatch || idMatch || clubMatch;

    const categoryMatch = filterCategory === "all" || r.category === filterCategory;
    return textMatch && categoryMatch;
  });

  // Calculate statistics
  const totalCount = initialData.length;
  const filteredCount = filteredData.length;
  const totalEntryFees = totalCount * 500;
  
  // Count by category
  const categoryCounts = initialData.reduce((acc: { [key: string]: number }, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  // Download filtered data as CSV
  const downloadCSV = () => {
    const headers = [
      "Registration ID",
      "Created At",
      "Full Name",
      "Date of Birth",
      "Gender",
      "Mobile",
      "Email",
      "FIDE ID",
      "FIDE Rating",
      "Category",
      "Club / School",
      "City & State",
      "Screenshot URL"
    ];

    const rows = filteredData.map((r) => [
      r.id,
      new Date(r.created_at).toLocaleString(),
      `"${(r.full_name || "").replace(/"/g, '""')}"`,
      r.dob,
      r.gender,
      r.mobile,
      r.email || "",
      r.fide_id || "",
      r.fide_rating || "",
      categoryLabels[r.category] || r.category.toUpperCase(),
      `"${((r.club || r.academy_name) || "").replace(/"/g, '""')}"`,
      `"${(r.city_state || "").replace(/"/g, '""')}"`,
      r.screenshot_url
    ]);

    const csvString = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rkchess_registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerTexts}>
          <h1>RK Chess Academy Admin Panel</h1>
          <p>Manage registrations for the Summer Open Chess Tournament (07-06-2026)</p>
        </div>
        <div className={styles.headerActions}>
          {/* Tournament Toggle Button */}
          <button
            onClick={toggleTournamentSetting}
            disabled={isUpdatingSetting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: isTournamentActive ? "#15803d" : "#dc2626",
              color: "white",
              transition: "all 0.2s ease",
            }}
            title="Toggle Tournament Page Route Visibility"
          >
            <Trophy size={16} />
            Tournament Mode: {isTournamentActive ? "ON (Active)" : "OFF (Hidden)"}
          </button>

          <Link href="/" className={`${styles.btnAction} ${styles.btnSecondary}`}>
            <ArrowLeft size={16} />
            Website Home
          </Link>
          {onLogout && (
            <button onClick={onLogout} className={`${styles.btnAction} ${styles.btnSecondary}`}>
              <LogOut size={16} />
              Logout
            </button>
          )}
          {filteredCount > 0 && (
            <button onClick={downloadCSV} className={`${styles.btnAction} ${styles.btnPrimary}`}>
              <Download size={16} />
              Export to Excel (CSV)
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={styles.alertError}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <AlertTriangle size={20} />
            <strong>Database Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrapper} ${styles.iconPurple}`}>
            <Users size={20} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Registrations</span>
            <span className={styles.metricValue}>{totalCount}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrapper} ${styles.iconGreen}`}>
            <CreditCard size={20} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Fees (Est.)</span>
            <span className={styles.metricValue}>₹{totalEntryFees}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrapper} ${styles.iconOrange}`}>
            <Trophy size={20} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Open Category</span>
            <span className={styles.metricValue}>{categoryCounts["open"] || 0}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrapper} ${styles.iconRed}`}>
            <Calendar size={20} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Age Groups (U7-U15)</span>
            <span className={styles.metricValue}>
              {totalCount - (categoryCounts["open"] || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={styles.controlsRow}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={16} />
          <input
            type="text"
            placeholder="Search by Player Name, Phone, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          <option value="u7">Under 7 ({categoryCounts["u7"] || 0})</option>
          <option value="u9">Under 9 ({categoryCounts["u9"] || 0})</option>
          <option value="u11">Under 11 ({categoryCounts["u11"] || 0})</option>
          <option value="u13">Under 13 ({categoryCounts["u13"] || 0})</option>
          <option value="u15">Under 15 ({categoryCounts["u15"] || 0})</option>
          <option value="open">Open (All Ages) ({categoryCounts["open"] || 0})</option>
        </select>
      </div>

      {/* Main Table */}
      {filteredCount === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No Registrations Found</h2>
          <p>Try adjusting your search criteria or filter category.</p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Player Details</th>
                  <th>Category</th>
                  <th>Date of Birth</th>
                  <th>FIDE Info</th>
                  <th>WhatsApp Support</th>
                  <th>Payment Screenshot</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((player) => (
                  <tr key={player.id}>
                    <td>
                      <div className={styles.playerCell}>
                        <span className={styles.playerName}>{player.full_name}</span>
                        {(player.club || player.academy_name) && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                            🏛️ {player.club || player.academy_name}
                          </span>
                        )}
                        <code className={styles.playerId}>{player.id}</code>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.categoryBadge} ${
                          player.category === "open" ? styles.catOrange : styles.catGreen
                        }`}
                      >
                        {categoryLabels[player.category] || player.category.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(player.dob).toLocaleDateString()}</td>
                    <td>
                      {player.fide_id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                          <span><strong>ID:</strong> {player.fide_id}</span>
                          {player.fide_rating && <span><strong>Rating:</strong> {player.fide_rating}</span>}
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>None</span>
                      )}
                    </td>
                    <td>
                      <a
                        href={`https://wa.me/91${player.mobile.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappLink}
                      >
                        📱 {player.mobile}
                      </a>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setSelectedScreenshot({ url: player.screenshot_url, name: player.full_name })
                        }
                        className={styles.screenshotLink}
                        type="button"
                      >
                        <ExternalLink size={12} />
                        View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className={styles.modalOverlay} onClick={() => setSelectedScreenshot(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Payment Proof: {selectedScreenshot.name}</h3>
              <button onClick={() => setSelectedScreenshot(null)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalImageWrapper}>
                <img
                  src={selectedScreenshot.url}
                  alt={`Payment Slip for ${selectedScreenshot.name}`}
                  className={styles.modalImage}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <span className={styles.metaInfo}>
                <a
                  href={selectedScreenshot.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappLink}
                >
                  Open in New Tab <ExternalLink size={12} />
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
