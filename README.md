# WasteWise ♻️ Smart Waste Management System

Welcome to **WasteWise** – a smart, user-centric application designed to streamline waste bin management and waste collection. WasteWise leverages modern front-end frameworks for both web and mobile platforms to provide administrators, collectors, and users with an interactive experience for handling waste bin types, purchases, collections, and more. The project uses React with TypeScript, Material Tailwind for sleek UI components, and Expo & React Native for mobile experiences, while integrating with Firebase for backend data management.

-----------------------------------------------------------
## 🚀 Introduction

**WasteWise** is a comprehensive solution developed to modernize waste bin management. It allows administrators to:
  
- **Create, update, and manage bin types** along with pricing and waste type configurations.
- **Integrate waste collection mechanisms** by enabling collectors to update and collect waste data.
- **Generate receipts and PDF reports** for transactions and waste collection events.
- **Deliver a seamless cross-platform user experience** through a sophisticated web dashboard and mobile interfaces for users and collectors.

The repository contains separate projects for web interfaces (e.g., Frontend_Web) and mobile applications (Frontend_User and Frontend_mobile), ensuring a consistent user experience across platforms.

-----------------------------------------------------------
## ✨ Features

- **Bin Type Management:**  
  Create and update various waste bin types, including options for recyclable bins. Detailed forms and table views make it easy to see bin details, pricing, and capacity options .

- **Waste Collection and Tracking:**  
  Enable collectors to record waste levels, update bin conditions, and automatically update waste levels using real-time data. The mobile collector screens include QR code generation, waste summary data and collection history.

- **Responsive UI and Dashboard:**  
  Seamless integration using Material Tailwind, with components such as IconButton, Typography, and Chip for visually appealing dashboards. Real-time notifications and data updates enhance user interaction .

- **PDF Receipts and Reports:**  
  Generate and share customizable PDF receipts directly from the app, built using the Expo ecosystem for mobile support .

- **Easy Integration with Firebase:**  
  Uses Firebase for data storage and authentication, ensuring secure and scalable backend services.

-----------------------------------------------------------
## 💻 Requirements

Before you begin, please ensure you have met the following requirements:

- **Node.js:** v14.x or later
- **npm or yarn:** Dependency manager
- **Expo CLI:** For mobile app development (if building the mobile apps)
- **Git:** For cloning the repository
- **Firebase Configuration:** A Firebase project set up with Firestore is required for proper integration

Additionally, review the dependencies in the package.json files from the Frontend_Web project, which include libraries like:  
  
| Library               | Version         |
|-----------------------|-----------------|
| React                 | ^18.x           |
| TypeScript            | ^4.x / ^5.x     |
| Material Tailwind     | Latest          |
| react-router-dom      | ^6.x            |
| Tailwind CSS          | ^3.4.x          |
| Expo (for mobile)     | Latest          |

-----------------------------------------------------------
## 🔧 Installation

Follow these steps to set up the WasteWise project locally on your machine:

1. **Clone the Repository:**

   Run the following command in your terminal:
   ------------------------------------------------------------------
   git clone https://github.com/IT22052124/CSSE-WasteWise.git
   ------------------------------------------------------------------

2. **Install Dependencies for Web:**

   Navigate to the Frontend_Web directory and install dependencies:
   ------------------------------------------------------------------
   cd CSSE-WasteWise/Frontend_Web
   npm install   // or yarn install
   ------------------------------------------------------------------
   
   The web project leverages Vite as a build tool as seen in the package.json and postcss configuration (fileciteturn0file16, fileciteturn0file17).

3. **Install Dependencies for Mobile Projects:**

   For the mobile versions (both Frontend_User and Frontend_mobile), follow these steps:
   - Navigate to the respective directories:
     ------------------------------------------------------------------
     cd CSSE-WasteWise/Frontend_User   // or Frontend_mobile
     ------------------------------------------------------------------
   - Install dependencies using Expo CLI:
     ------------------------------------------------------------------
     npm install   // or yarn install
     expo start
     ------------------------------------------------------------------

4. **Firebase Setup:**

   Create a Firebase project and set up Firestore. Update your Firebase configuration in the project files where required. Refer to your Firebase project's configuration for proper integration.

-----------------------------------------------------------
## 🤝 Contributing

We welcome contributions from the community to improve WasteWise. To contribute:

- **Fork the repository** on GitHub.
- **Clone your fork** to your local machine.
- **Create a new branch** for your feature or bug fix:
  ------------------------------------------------------------------
  git checkout -b feature/my-new-feature
  ------------------------------------------------------------------
- **Commit your changes** with clear and descriptive commit messages.
- **Push your branch** to GitHub:
  ------------------------------------------------------------------
  git push origin feature/my-new-feature
  ------------------------------------------------------------------
- Open a **Pull Request** detailing your changes. Please follow the project's coding standards and ensure your code is properly tested.

Your contributions help in making WasteWise better for everyone! 😀✨

-----------------------------------------------------------
## ⚙️ Configuration

Before running the app, ensure all configuration files and environment variables are correctly set up. This includes:

- **Firebase Settings:**  
  Update your Firebase configuration parameters in the respective config files. Some parts of the code rely on Firestore queries (for example, bin type queries and waste collection controllers).

- **Tailwind CSS Configuration:**  
  The web project uses a PostCSS configuration file (Frontend_Web/postcss.config.js) that must be present for Tailwind to work properly (fileciteturn0file17).

- **Expo Settings:**  
  Verify and adjust the Expo settings (in .expo/settings.json) if you encounter issues with the mobile app’s network or device connectivity (fileciteturn0file3).

Customize further configuration as required based on your environment.

-----------------------------------------------------------
## 🏃 Usage

Below you will find instructions to run the application:

### Web Application

1. **Development Mode:**
   ------------------------------------------------------------------
   cd CSSE-WasteWise/Frontend_Web
   npm run dev
   ------------------------------------------------------------------
   This command starts the Vite dev server, providing hot module replacement and a fast development experience.

2. **Production Build:**
   ------------------------------------------------------------------
   npm run build
   npm run preview
   ------------------------------------------------------------------
   This builds the optimized production version of the app and starts a static server to preview your build.

### Mobile Applications

1. **User and Collector Apps:**
   - Navigate to the Frontend_User or Frontend_mobile directory.
   - Run:
     ------------------------------------------------------------------
     expo start
     ------------------------------------------------------------------
   - Use the Expo Go app on your mobile device or an emulator to test the mobile app.

2. **Features in Use:**
   - **Bin Management:** Add new bin types or update existing ones through the web dashboard.
   - **Waste Collection:** Collect waste data and automatically update waste levels (see bin collection controllers in the code).
   - **PDF Generation and Receipts:** Generate PDFs from within the mobile app for bin purchase receipts and waste collection details.

The application is designed to be modular. For example, bin types are managed using specific pages (such as AddBinType and UpdateBinType) to ensure a smooth admin flow (fileciteturn0file5, fileciteturn0file6).

-----------------------------------------------------------
Thank you for checking out WasteWise! Enjoy exploring the project, and do not hesitate to contribute. Happy coding! 😀🚀
