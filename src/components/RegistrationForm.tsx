"use client";

import React, { useState } from "react";
import { 
  User, Calendar, Users, Phone, 
  Award, Hash, Trophy, MapPin, 
  Loader2, CheckCircle2, Copy, Check,
  CreditCard, Upload, Building2
} from "lucide-react";
import Image from "next/image";
import styles from "./RegistrationForm.module.css";

interface FormData {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  club: string;
  fideId: string;
  fideRating: string;
  category: string;
  cityState: string;
  paymentScreenshot: string; // Base64 representation of the payment screenshot
}

interface FormErrors {
  [key: string]: string;
}

// Auto-calculate category based on birth year for 2026 chess calendar
const calculateCategory = (dobString: string): string => {
  if (!dobString) return "";
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return "";
  
  const birthYear = dob.getFullYear();
  const age = 2026 - birthYear; // FIDE age calculation calendar year rule
  
  if (age <= 7) return "u7";
  if (age <= 9) return "u9";
  if (age <= 11) return "u11";
  if (age <= 13) return "u13";
  if (age <= 15) return "u15";
  return "open";
};

// Helper function to compress images using HTML5 Canvas client-side
const compressImage = (
  file: File, 
  maxWidth = 1000, 
  maxHeight = 1000, 
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions to maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original if context not supported
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to jpeg with specified quality (great compression ratio)
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    club: "",
    fideId: "",
    fideRating: "",
    category: "",
    cityState: "Anantapur, Andhra Pradesh", // Prefill for convenience
    paymentScreenshot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [regId, setRegId] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");

  // Categories containing both the flyer age limits and Open (All Ages) for older players
  const categories = [
    { value: "u7", label: "Under 7" },
    { value: "u9", label: "Under 9" },
    { value: "u11", label: "Under 11" },
    { value: "u13", label: "Under 13" },
    { value: "u15", label: "Under 15" },
    { value: "open", label: "Open (All Ages)" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate category when Date of Birth changes
      if (name === "dob" && value) {
        const calculatedCategory = calculateCategory(value);
        if (calculatedCategory) {
          updated.category = calculatedCategory;
        }
      }
      
      return updated;
    });

    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        // If DOB changes and automatically fixes category, clear category error too
        if (name === "dob") {
          delete next.category;
        }
        return next;
      });
    }
  };

  // Convert and compress uploaded image to base64 for submission
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ 
          ...prev, 
          paymentScreenshot: "Please upload an image file (PNG, JPG, or JPEG)" 
        }));
        return;
      }

      setFileName(file.name);
      
      try {
        // Compress image to max 1000px width/height and 70% quality in browser
        const compressedBase64 = await compressImage(file, 1000, 1000, 0.7);
        setFormData((prev) => ({ ...prev, paymentScreenshot: compressedBase64 }));
        
        if (errors.paymentScreenshot) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.paymentScreenshot;
            return next;
          });
        }
      } catch (err) {
        console.error("Image compression failed, using original file:", err);
        // Fallback to original uncompressed file if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, paymentScreenshot: reader.result as string }));
          if (errors.paymentScreenshot) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.paymentScreenshot;
              return next;
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters long";
    }

    // DOB
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(formData.dob);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Mobile (10 digits check)
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile.replace(/[\s-]/g, ""))) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    // No email validation needed

    // Category
    if (!formData.category) {
      newErrors.category = "Tournament category is required";
    }

    // City & State
    if (!formData.cityState.trim()) {
      newErrors.cityState = "City and State details are required";
    }

    // Payment Screenshot (Mandatory)
    if (!formData.paymentScreenshot) {
      newErrors.paymentScreenshot = "Please upload the payment confirmation screenshot";
    }

    // FIDE Rating (if entered, check number)
    if (formData.fideRating) {
      const ratingNum = parseInt(formData.fideRating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 3000) {
        newErrors.fideRating = "Enter a valid rating between 0 and 3000";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setRegId(data.registrationId);
        setSubmitSuccess(true);
      } else {
        setErrors({ form: data.error || "Something went wrong. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: "Failed to connect to the server. Please check your internet connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(regId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      dob: "",
      gender: "",
      mobile: "",
      club: "",
      fideId: "",
      fideRating: "",
      category: "",
      cityState: "Anantapur, Andhra Pradesh",
      paymentScreenshot: "",
    });
    setErrors({});
    setFileName("");
    setSubmitSuccess(false);
    setRegId("");
  };

  // Helper to show calculated age
  const getPlayerAge2026 = (): number | null => {
    if (!formData.dob) return null;
    const dob = new Date(formData.dob);
    if (isNaN(dob.getTime())) return null;
    return 2026 - dob.getFullYear();
  };

  const playerAge = getPlayerAge2026();
  const selectedCatLabel = categories.find((c) => c.value === formData.category)?.label;

  if (submitSuccess) {
    // Construct pre-filled WhatsApp message content
    const message = `*RK Chess Academy - Summer Open Chess Tournament Registration*

*Registration ID:* ${regId}
*Player Name:* ${formData.fullName}
*Date of Birth:* ${formData.dob}
*Category:* ${selectedCatLabel}
*WhatsApp No:* ${formData.mobile}
*City & State:* ${formData.cityState}
${formData.club ? `*Club / School:* ${formData.club}` : ""}
${formData.fideId ? `*FIDE ID:* ${formData.fideId}` : ""}
${formData.fideRating ? `*FIDE Rating:* ${formData.fideRating}` : ""}

_Note: Payment screenshot uploaded successfully._`;

    const whatsappUrl = `https://wa.me/919700793197?text=${encodeURIComponent(message)}`;

    return (
      <div className={styles.successCard}>
        <div className={styles.successIconWrapper}>
          <CheckCircle2 className={styles.successIcon} size={50} />
        </div>
        <h2 className={styles.successTitle}>Successfully Registered!</h2>
        <p className={styles.successSubtitle}>
          {formData.fullName} has been registered for the tournament. Show this slip at the venue.
        </p>

        <div className={styles.ticket}>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Registration ID</span>
            <div className={styles.ticketIdWrapper}>
              <code className={styles.ticketId}>{regId}</code>
              <button 
                onClick={handleCopyId} 
                className={styles.copyBtn}
                title="Copy ID"
                type="button"
              >
                {copied ? <Check size={16} className={styles.copiedIcon} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <div className={styles.ticketDivider} />
          <div className={styles.ticketGrid}>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Player Name</span>
              <span className={styles.ticketValue}>{formData.fullName}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Category</span>
              <span className={styles.ticketValue}>{selectedCatLabel}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Mobile</span>
              <span className={styles.ticketValue}>{formData.mobile}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>City & State</span>
              <span className={styles.ticketValue}>{formData.cityState}</span>
            </div>
            {formData.club && (
              <div className={styles.ticketItem}>
                <span className={styles.ticketLabel}>Club / School</span>
                <span className={styles.ticketValue}>{formData.club}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.successActions}>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimaryWhatsapp}
          >
            Send Slip to Coach on WhatsApp
          </a>
          <button 
            onClick={handleResetForm} 
            className={styles.btnSecondary}
            type="button"
          >
            Register Another Player
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {errors.form && (
          <div className={styles.formAlert}>
            <span>{errors.form}</span>
          </div>
        )}

        {/* Section 1: Required Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <User size={18} className={styles.sectionIcon} />
            Player Details
          </h3>
          
          <div className={styles.grid}>
            <div className={`${styles.fieldGroup} ${errors.fullName ? styles.hasError : ""}`}>
              <label htmlFor="fullName">Full Name <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={16} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter Player's Name"
                  className={styles.input}
                  required
                />
              </div>
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className={`${styles.fieldGroup} ${errors.dob ? styles.hasError : ""}`}>
              <label htmlFor="dob">Date of Birth <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
                <Calendar className={styles.inputIcon} size={16} />
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              {errors.dob && <span className={styles.errorText}>{errors.dob}</span>}
            </div>

            <div className={`${styles.fieldGroup} ${errors.gender ? styles.hasError : ""}`}>
              <label htmlFor="gender">Gender <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
                <Users className={styles.inputIcon} size={16} />
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Boy</option>
                  <option value="female">Girl</option>
                </select>
              </div>
              {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
            </div>

            <div className={`${styles.fieldGroup} ${errors.mobile ? styles.hasError : ""}`}>
              <label htmlFor="mobile">Mobile Number (WhatsApp) <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} size={16} />
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="10-digit WhatsApp number"
                  className={styles.input}
                  required
                />
              </div>
              {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
            </div>

            <div className={`${styles.fieldGroup} ${errors.category ? styles.hasError : ""}`}>
              <label htmlFor="category">Tournament Category <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
                <Trophy className={styles.inputIcon} size={16} />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="" disabled>Select Age Category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              {formData.dob && playerAge !== null && (
                <span className={styles.autoSelectNote}>
                  Auto-selected: <strong>{selectedCatLabel}</strong> (Chess age: {playerAge})
                </span>
              )}
              {errors.category && <span className={styles.errorText}>{errors.category}</span>}
            </div>

            <div className={`${styles.fieldGroup} ${errors.cityState ? styles.hasError : ""}`}>
              <label htmlFor="cityState">City & State <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
                <MapPin className={styles.inputIcon} size={16} />
                <input
                  type="text"
                  id="cityState"
                  name="cityState"
                  value={formData.cityState}
                  onChange={handleInputChange}
                  placeholder="e.g. Anantapur, Andhra Pradesh"
                  className={styles.input}
                  required
                />
              </div>
              {errors.cityState && <span className={styles.errorText}>{errors.cityState}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="club">Club Name <span className={styles.optionalLabel}>(Optional)</span></label>
              <div className={styles.inputWrapper}>
                <Building2 className={styles.inputIcon} size={16} />
                <input
                  type="text"
                  id="club"
                  name="club"
                  value={formData.club}
                  onChange={handleInputChange}
                  placeholder="e.g. RK Chess Academy / School"
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Tournament Payment (Mandatory) */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <CreditCard size={18} className={styles.sectionIcon} />
            Tournament Entry Fee Payment
          </h3>
          
          <p className={styles.paymentInfoText}>
            Scan the QR code below to pay the entry fee of <strong>₹500</strong>. Take a screenshot of the payment confirmation and upload it here to secure your registration.
          </p>

          <div className={styles.qrCard}>
            <div className={styles.qrImageWrapper}>
              <Image 
                src="/qr.jpeg" 
                alt="UPI Payment QR Code" 
                width={180} 
                height={180}
                className={styles.qrImage}
                unoptimized
              />
              <span className={styles.qrLabel}>Scan to pay ₹500</span>
            </div>

            <div className={`${styles.fieldGroup} ${errors.paymentScreenshot ? styles.hasError : ""}`}>
              <label htmlFor="paymentScreenshot">
                Upload Payment Screenshot <span className={styles.required}>*</span>
              </label>
              
              <div className={styles.fileUploadWrapper}>
                <label htmlFor="paymentScreenshotInput" className={styles.fileUploadBtn}>
                  <Upload size={16} />
                  Choose File
                </label>
                <input
                  type="file"
                  id="paymentScreenshotInput"
                  name="paymentScreenshot"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInputHidden}
                  required
                />
                <span className={styles.fileNameText}>
                  {fileName ? fileName : "Select payment screenshot (PNG, JPG, JPEG)"}
                </span>
              </div>

              {formData.paymentScreenshot && (
                <div className={styles.previewContainer}>
                  <img 
                    src={formData.paymentScreenshot} 
                    alt="Payment Screenshot Preview" 
                    className={styles.previewImage} 
                  />
                  <span className={styles.previewLabel}>Screenshot Loaded successfully ✓</span>
                </div>
              )}
              {errors.paymentScreenshot && <span className={styles.errorText}>{errors.paymentScreenshot}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: FIDE Chess Details (Optional) */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Award size={18} className={styles.sectionIcon} />
            FIDE Details (Optional)
          </h3>
          
          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="fideId">FIDE ID <span className={styles.optionalLabel}>(Optional)</span></label>
              <div className={styles.inputWrapper}>
                <Hash className={styles.inputIcon} size={16} />
                <input
                  type="text"
                  id="fideId"
                  name="fideId"
                  value={formData.fideId}
                  onChange={handleInputChange}
                  placeholder="e.g. 12345678"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={`${styles.fieldGroup} ${errors.fideRating ? styles.hasError : ""}`}>
              <label htmlFor="fideRating">FIDE Rating <span className={styles.optionalLabel}>(Optional)</span></label>
              <div className={styles.inputWrapper}>
                <Award className={styles.inputIcon} size={16} />
                <input
                  type="number"
                  id="fideRating"
                  name="fideRating"
                  value={formData.fideRating}
                  onChange={handleInputChange}
                  placeholder="e.g. 1100"
                  className={styles.input}
                  min="0"
                  max="3000"
                />
              </div>
              {errors.fideRating && <span className={styles.errorText}>{errors.fideRating}</span>}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={styles.submitBtn}
        >
          {isSubmitting ? (
            <>
              <Loader2 className={styles.spinner} size={18} />
              Registering Player...
            </>
          ) : (
            "Complete Tournament Registration"
          )}
        </button>
      </form>
    </div>
  );
}
