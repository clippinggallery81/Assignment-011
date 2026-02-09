# AssetVerse

Corporate Asset Management System for HR and employees. Track company assets, requests, assignments, and subscriptions in one dashboard.

## Live URL

- https://your-live-url.example.com

## Key Features

- HR and Employee role-based dashboards
- Asset inventory, requests, approvals, and returns
- Company affiliations and employee team view
- Recharts analytics (HR and Employee)
- Stripe-based package upgrades with payment history
- JWT-protected APIs and session persistence

## Tech Stack

- React + Vite
- Tailwind CSS + DaisyUI
- Firebase Auth
- Recharts
- Axios

## Packages Used

- firebase
- react-router-dom
- sweetalert2
- recharts
- react-hook-form
- axios
- daisyui

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_image_host_key=your_imgbb_key
```

Run the app:

```bash
npm run dev
```

## Notes

- Backend server must be running for API calls.
- Stripe checkout requires server-side Stripe keys.
