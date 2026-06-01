"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import AdminDashboard from "@/components/AdminDashboard";
import styles from "./page.module.css";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);

  // Form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch registrations from API
  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();

      if (res.ok && data.success) {
        setRegistrations(data.registrations);
        setIsLoggedIn(true);
        setDbError(null);
      } else {
        setIsLoggedIn(false);
        if (res.status !== 401) {
          setDbError(data.error || "Failed to fetch registrations.");
        }
      }
    } catch (err) {
      console.error("Error loading registrations:", err);
      setIsLoggedIn(false);
      setDbError("An error occurred while loading data from the database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormSuccess("Login successful! Loading dashboard...");
        // Fetch registrations and transition
        await fetchRegistrations();
      } else {
        setFormError(data.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setFormError("An error occurred while attempting to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        setIsLoggedIn(false);
        setRegistrations([]);
        setUsername("");
        setPassword("");
        setFormSuccess(null);
        setFormError(null);
      } else {
        console.error("Failed to logout on server.");
      }
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.adminContainer}>
          <div className={styles.spinner} style={{ borderColor: "var(--brand-purple)", borderTopColor: "transparent", width: "40px", height: "40px", borderWidth: "3px" }}></div>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className={styles.adminPage}>
        <main style={{ padding: "2rem 1rem", flex: 1 }}>
          <div className="container">
            <AdminDashboard initialData={registrations} error={dbError || undefined} onLogout={handleLogout} />
          </div>
        </main>
        <footer className={styles.footer}>
          <div className="container">
            <div className={styles.footerContent}>
              <p className={styles.footerCopyright}>&copy; {new Date().getFullYear()} RK Chess Academy Anantapuramu. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminContainer}>
        <div className={styles.authCard}>
          {/* Header Branding */}
          <div className={styles.authHeader}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.jpeg"
                alt="RK Chess Academy Logo"
                width={64}
                height={64}
                className={styles.logoImage}
                priority
                unoptimized
              />
            </div>
            <h1 className={styles.title}>RK CHESS ACADEMY</h1>
            <p className={styles.subtitle}>Admin Portal</p>
          </div>

          {/* Auth form */}
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            {formError && (
              <div className={`${styles.alert} ${styles.alertError}`}>
                <AlertCircle className={styles.alertIcon} size={16} />
                <span>{formError}</span>
              </div>
            )}
            
            {formSuccess && (
              <div className={`${styles.alert} ${styles.alertSuccess}`}>
                <CheckCircle2 className={styles.alertIcon} size={16} />
                <span>{formSuccess}</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Email Address</label>
              <input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@rkchess2026.com"
                className={styles.input}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={styles.input}
                required
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Logging in...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Login to Dashboard
                </>
              )}
            </button>

            <Link href="/" style={{ display: "flex", gap: "0.25rem", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginTop: "0.5rem" }}>
              <ArrowLeft size={12} /> Back to registrations form
            </Link>
          </form>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <p className={styles.footerCopyright}>&copy; {new Date().getFullYear()} RK Chess Academy Anantapuramu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
