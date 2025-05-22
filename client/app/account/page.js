// app/account/page.js
"use client";

import { useRouter } from "next/navigation";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const router = useRouter();

  const accountCards = [
    {
      title: "My Profile",
      icon: "👤",
      description:
        "Manage your personal information, preferences, and settings",
      features: [
        "Personal Details",
        "Password Management",
        "Email Preferences",
        "Privacy Settings",
      ],
      path: "/account/profile",
    },
    {
      title: "Security Settings",
      icon: "🔑",
      description:
        "Keep your information secure with two-factor authentication and password management",
      features: [
        "Password Management",
        "Email Preferences",
        "Privacy Settings",
      ],
      path: "/account/security",
    },
    {
      title: "Uploads",
      icon: "📤", // Upload icon
      description:
        "Manage your uploaded content, including articles and videos",
      features: [
        "Upload New Content",
        "Manage Existing Uploads",
        "Delete Unwanted Uploads",
      ],
      path: "/account/uploads",
    },
    {
      title: "Bookmarks",
      icon: "🔖", // Bookmark icon
      description: "You can see & manage your bookmarks here",
      features: [
        "Bookmark Your Favorite articles or videos",
        "Manage Your Bookmarks",
      ],
      path: "/account/bookmarks",
    },
  ];

  const handleCardClick = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountHeader}>
        <h1 className="font-bold">My Account</h1>
        <p>Manage your profile, bookmarks, uploads and security settings</p>
      </div>

      <div className={styles.cardsGrid}>
        {accountCards.map((card, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => handleCardClick(card.path)}
          >
            <div className={styles.cardIcon}>{card.icon}</div>
            <h2>{card.title}</h2>
            <p className={styles.description}>{card.description}</p>
            <div className={styles.featuresList}>
              {card.features.map((feature, featureIndex) => (
                <div key={featureIndex} className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
