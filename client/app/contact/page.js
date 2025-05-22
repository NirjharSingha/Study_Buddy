"use client";
import { useState } from "react";
import styles from "./ContactPage.module.css";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number formatting
    if (name === "phone") {
      const formatted = value
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        ?.slice(1)
        .join("")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
        .trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const message = `Name : ${formData.fullName}\nEmail : ${formData.email}\nPhone : ${formData.phone}\nComplaint : ${formData.message}`;

      emailjs
        .send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          {
            to_name: "Administration Team",
            to_email: "dummydummy004400@gmail.com",
            message: message,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )
        .then(
          async () => {
            setSuccessMessage("Message sent successfully!");
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              message: "",
            });
            setTimeout(() => setSuccessMessage(""), 3000);
          },
          (error) => {
            console.log("Error:", error);
            throw new Error("Failed to send message");
          }
        );
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Failed to send message. Please try again later." });
    }
  };

  return (
    <div
      className={styles.contactContainer}
      style={{ height: "calc(100svh - 69.6px)" }}
    >
      <div className={styles.contactInfo}>
        <h1>Contact Us</h1>
        <p>
          Not sure what you need? The team at Square Events will be happy to
          listen to you and suggest event ideas you hadn't considered
        </p>

        <div className={styles.contactDetails}>
          <p>
            <span className={styles.icon}>✉️</span>
            info@squareevents.com
          </p>
          <p>
            <span className={styles.icon}>📞</span>
            Support: (+21) 123 456 586
          </p>
        </div>
      </div>

      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <h2>We'd love to hear from you!</h2>
          <h3>Let's get in touch</h3>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        {errors.submit && (
          <div className={styles.errorMessage}>{errors.submit}</div>
        )}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? styles.errorInput : ""}
            />
            {errors.fullName && (
              <span className={styles.errorText}>{errors.fullName}</span>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ""}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <textarea
            name="message"
            placeholder="Type your message here"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? styles.errorInput : ""}
          />
          {errors.message && (
            <span className={styles.errorText}>{errors.message}</span>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Send Message
        </button>
      </form>
    </div>
  );
}
