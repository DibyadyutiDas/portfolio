# 🌐 Personal Portfolio Website

Welcome to my personal portfolio website! This project showcases my skills, projects, and passion for technology and creativity. It is designed to be fast, responsive, and easy to navigate across all devices.

## 🚀 Live Demo

👉 [Visit Website](https://dibyadyutidas.github.io/portfolio/)

## 📌 Features

- ✨ Clean and modern UI  
- 📱 Fully responsive for all screen sizes  
- 💼 Project showcase section  
- 📄 Resume download  
- 🌐 Social links integration  
- 🖱️ Smooth scrolling and interactive hover effects  
- ⚙️ Scroll-based animations (AOS)

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript**
- **AOS (Animate On Scroll)**
- **Font Awesome / Icons**

### New: Backend auth service

- **Node.js + Express**
- **Passport (Google + GitHub OAuth)**
- **MongoDB + connect-mongo session store**


## 🧩 Sections Included

- **Header:** Name, short intro, and navigation  
- **About:** Bio and interests  
- **Projects/Websites:** Scrollable card layout with hover effects  
- **Contact:** Email, social links, and message form (if added)

## 🔐 Login and backend setup

1) Install dependencies

```
cd server
npm install
```

2) Configure environment

- Copy `server/.env.example` to `server/.env`.
- Set `MONGODB_URI`, `SESSION_SECRET`, and OAuth credentials for Google and GitHub.
- Update `CLIENT_ORIGIN` to the origin that serves `index.html` / `login.html` (e.g., `http://localhost:3000`).
- If hosting the API separately, set `OAUTH_CALLBACK_BASE` to the public API URL.

3) Run the API locally

```
npm run dev
```

The auth server starts on `http://localhost:4000` by default with routes:

- `GET /auth/google` and `GET /auth/github` start OAuth
- `GET /auth/me` returns the current user (cookie-based session)
- `POST /auth/logout` destroys the session
- `GET /health` simple health probe

4) Frontend login page

- Visit `/login.html` from the site to sign in with Google or GitHub.
- The page uses `localStorage.apiBase` (or `window.APP_CONFIG.apiBase`) to point to the API base; default is `http://localhost:4000`.

## 🌟 Support

If you found this project helpful or inspiring, please consider giving it a **star** ⭐️ on [GitHub](https://github.com/DibyadyutiDas/portfolio). It helps me stay motivated and reach more developers like you!

## 🧠 Inspiration

This website is a part of my ongoing journey in front-end development and web design. Every section is hand-coded with learning and improvement in mind.

## 📬 Contact

If you’d like to connect or collaborate, feel free to reach out:

- 📧 Email: dibyadyutidas0@gmail.com  
---

> **Note:** This is a personal project. Feel free to fork, clone, and customize it for your own use!

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

