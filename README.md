# 📚 Parent-Teacher Association (PTA) App

A mobile-first web application designed to enhance communication between parents, teachers, and PTA members. Built with **React** for the frontend and **Firebase** for backend services, the PTA App streamlines announcements, messaging, events, and document sharing, ensuring a stronger school community.

## ✨ Features

### 🔐 User Management
- Role-based accounts: **Parents**, **Teachers**.
- Teachers can link multiple children to a single account.
- Secure authentication and role-based access control.

### 💬 Communication & Messaging
- Teachers and PTA can **send messages** to individuals, classes, or groups.
- Parents can **reply** or **acknowledge** messages.
- **Urgency** and **topics** specified for meetings.

### 🗕️ School Calendar & Events
- Calendar that can have events added to that all users from the same school can see

### 📰 Newsletter & Document Access
- View **newsletters** and **download important documents** like permission slips and fee notices.

### 🛠️ Admin Panel
- School admins can manage users, send announcements, and update events through a secure admin dashboard.

## 🏗️ Tech Stack

| Frontend        | Backend        | Other Integrations                  |
|-----------------|----------------|--------------------------------------|
| React.js        | Firebase Authentication | Google Calendar API                |
| React Router    | Firebase Firestore (Database) | Apple Calendar Integration      |
| Tailwind CSS (or similar UI library) | Firebase Cloud Messaging (Notifications) | WhatsApp/Email Notification Support (optional) |

## 📱 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dwengo7/PTA-App.git
   cd pta-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password or Google Sign-In).
   - Set up **Firestore** Database.
   - Set up **Firebase Cloud Messaging** for notifications.
   - Copy your Firebase config and place it in your `.env` file:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the app locally**
   ```bash
   npm start
   ```

5. **Deploy (optional)**
   - You can deploy using **Firebase Hosting**

## 🚀 Future Improvements

- Multi-language support (Internationalization - i18n)
- Dark mode / Light mode toggle
- More third-party integration (WhatsApp messaging)
- Analytics dashboard for PTA/Admins

## 🔒 Security Considerations

- End-to-end encryption for sensitive data.
- Role-based access control.
- Firebase Rules enforced for database and storage security.

## 🤝 Contribution

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a **Pull Request**

## 📄 License

This project is for educational purposes as part of a **Final Year Project**.  
You are free to customize and adapt it for personal, academic, or internal organizational use.
