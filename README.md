#  WasteWise ♻️🚮 Smart Waste Management System

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

## 💾 Installation

Follow these steps to install and run WasteWise on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/IT22052124/CSSE-WasteWise.git
cd CSSE-WasteWise
```

### 2. Install Dependencies

There are separate directories for the web and mobile applications:

#### For the Web Application

```bash
cd Frontend_Web
npm install
# or if you're using yarn
yarn install
```

#### For the Mobile Application

```bash
cd ../Frontend_mobile
npm install
# or if you're using yarn
yarn install
```

### 3. Configure Firebase

- Create a Firebase Project and enable Firestore.
- Set up the required Firebase configuration in a new file (e.g., `firebaseConfig.js` or within your environment variables).
- Ensure that the collection names such as "bins", "wasteTypes", "binTypes", and "users" are correctly configured as per the code references .

### 4. Start the Applications

#### For Web

```bash
cd Frontend_Web
npm run dev
```

#### For Mobile (Expo)

```bash
cd Frontend_mobile
expo start
```

Your web app will launch on your default browser and the mobile app can be previewed using the Expo client.

-----------------------------------------------------------

## 🤝 Contributing

We welcome contributions from the community! Feel free to open issues or submit pull requests for improvements, bug fixes, or new feature additions.

**Guidelines for Contributing:**
- Fork the repository and create a new branch for your feature or bug fix.
- Write clear, concise commit messages.
- Ensure your code follows the existing style conventions (Tailwind CSS and Material Tailwind for styling, React standards, etc.).
- Submit a pull request with a detailed description of your changes.

For more details, refer to the repository’s CONTRIBUTING.md file if provided, or follow our GitHub contribution guidelines.

-----------------------------------------------------------

## 🔧 Configuration

WasteWise is built to be highly configurable. Common configuration scope includes:

- **Firebase Configuration:**  
  Place your Firebase API keys and settings in a configuration file. Adjust the Firebase initialization inside controllers such as `BinsController.ts` .

- **Tailwind and Material Tailwind Settings:**  
  Customize your themes and styles in `tailwind.config.js` and from Material Tailwind components.  
  Additionally, use the provided PostCSS configuration in `postcss.config.js` .

- **Environment Variables:**  
  Set environment variables for API endpoints and secret keys. These are usually stored in a `.env` file at the root of each project segment.

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
