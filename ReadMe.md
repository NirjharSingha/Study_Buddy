# 📘 StudyBuddy — Inclusive Learning Platform for Science & Math

**StudyBuddy** is a web-based educational platform designed to make science and math engaging, inclusive, and accessible for students from Class 1–8 in Bangladesh. Built with modern technologies like **Next.js**, **Spring Boot**, and **MySQL**, the platform focuses on bilingual content delivery, gamification, and collaborative learning.

---

## 🚩 Problem Statement

Many students in Bangladesh struggle to understand core science concepts due to:

- Limited access to interactive learning materials
- Language barriers (English-heavy content)
- Lack of collaborative platforms for peer learning
- Inaccessibility for rural or low-bandwidth users
- Diverse literacy levels not being accommodated

---

## ✅ Solution: StudyBuddy

StudyBuddy addresses these challenges by offering:

- 🔁 **Interactive simulations** for physics, chemistry, and math
- 🌐 **Bilingual resources** in English and Bangla (with AI translation)
- 🎥 **User-generated content** (articles, videos) by class and subject
- ✅ **Admin verification** for quality control
- 🎮 **Gamification**: quizzes, points, and leaderboards
- 👤 **User personalization** with bookmarks and profiles
- 💸 **Monetization**: earn money through contributions and engagement
- ♿ **Accessibility**: low-bandwidth support, WCAG-compliant UI

---

## 🎯 Target Audience

- 🧒 Primary: Students from Class 1 to 8
- 👨‍🏫 Secondary: Teachers, especially in rural areas
- 🌍 Focus: Inclusive learning for diverse language and connectivity levels

---

## 💡 Key Features

| Feature              | Description |
|----------------------|-------------|
| 📚 Bilingual Content | English & Bangla with AI-assisted translation |
| 🔬 Simulations       | Interactive science & math demos |
| 🧑‍🎓 User Contributions | Students can upload videos/articles |
| 🧑‍⚖️ Admin Control     | Content verification for quality |
| 🎮 Gamification      | Quizzes, points, leaderboard |
| 🏆 Monetization      | Earn money via contribution points |
| 🔖 Personalization   | Bookmark resources, manage profile |
| 🌐 Accessibility     | Mobile-first, low-bandwidth optimized |

---

## 🛠️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | Next.js, Tailwind CSS, DaisyUI, ShadCN UI |
| Backend   | Spring Boot |
| Database  | MySQL |
| Others    | JWT Auth, REST APIs |

---

## 🚀 How to Run Locally

### 📦 Prerequisites
- Node.js ≥ 18
- Java ≥ 17
- MySQL Server
- Maven

### 🖥️ Frontend Setup

```bash
git clone https://github.com/NirjharSingha/Study_Buddy.git
cd Study_Buddy/client
npm install
npm run dev
```

### 🔧 Backend Setup

```bash
cd ../server
# Ensure application.properties is configured
mvn spring-boot:run
```

### 🔧 Run ai_simulations

```bash
cd ../ai_simulations
npm install
npm run dev
```

---

## 📈 Business Roadmap

- **Phase 1**  
  Launch a free platform with:
  - Core features (articles, videos, quizzes)
  - Basic AR-based learning simulations

- **Phase 2**  
  Introduce a points-based monetization model:
  - Students earn points from contributions and quiz performance
  - Points convertible to earnings

- **Phase 3**  
  Build partnerships with:
  - Schools and education boards
  - NGOs working in education
  - Private sector sponsors for reward funding

- **Revenue Model**
  - Freemium content & tiered access
  - Institutional subscriptions for insights & analytics
  - Sponsorships and CSR collaborations
  - In-app store for learning tools and simulations

---

