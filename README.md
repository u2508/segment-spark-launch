# Project info

# 📬 MessageIQ — Supabase-Powered CRM & Campaign Management Dashboard

MessageIQ is a modern, secure, and scalable CRM dashboard built with **React**, **TypeScript**, and **TailwindCSS**, fully integrated with **Supabase** for authentication and database management. It empowers teams to manage campaigns, audiences, reports, and settings with ease.

---

## 🚀 Features

- 🔐 **Supabase Auth** with support for Email/Password and OAuth providers
- 📊 **Campaign Management** with historical tracking and creation flow
- 👥 **Audience Manager** with filtering, tagging, and search (Supabase DB)
- 📈 **Reports Dashboard** with future-ready analytics (charts, KPIs)
- ⚙️ **User Settings** pulled from Supabase Auth metadata
- 🔧 **Protected Routes** using React Router and context-based auth guard
- 🧠 **React Query** for fast and cached server data
- 🧱 **Responsive Sidebar** with user initials, icon nav, and collapse toggle
- 💬 **API Documentation** section for external integration

---

## 🛠️ Tech Stack

| Layer         | Technology                  |
|--------------|-----------------------------|
| Frontend     | React + TypeScript          |
| Styling      | TailwindCSS + Custom Theme  |
| Backend (BaaS)| Supabase (Auth, DB, API)    |
| State/Data   | React Query                 |
| Routing      | React Router v6             |
| Icons/UI     | Lucide, shadcn/ui components|

---

## 📁 Project Structure

```

src/
│
├── components/           # UI and layout components (Sidebar, Button, etc.)
├── contexts/             # AuthContext with Supabase integration
├── pages/                # Route-based pages (Dashboard, Campaigns, etc.)
├── lib/                  # Utility functions (e.g., classnames)
├── App.tsx               # App with protected/auth routes
└── main.tsx              # Root React entry

````

---

## 🔧 Setup Instructions

### 1. 🧱 Clone & Install

```bash
git clone https://github.com/u2508/XENO-SDE-PROJECT
cd XENO-SDE-PROJECT
npm install
````

### 2. 🔐 Configure Supabase

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. ▶️ Run the App


The app will be live at: 

**URL**: https://lovable.dev/projects/267dd028-42f1-4ecc-b388-73ed1341c406

---

## 🔑 Authentication Flow

* AuthContext wraps the app and provides `user` and `loading` status
* `ProtectedRoute` ensures only logged-in users access protected routes
* `AuthRoute` redirects logged-in users away from login page

---

## 🗂️ Pages & Routes

| Route            | Component           | Auth Required |
| ---------------- | ------------------- | ------------- |
| `/auth`          | AuthPage            | No            |
| `/`              | Dashboard (Index)   | ✅ Yes         |
| `/campaigns`     | CampaignHistoryPage | ✅ Yes         |
| `/campaigns/new` | CreateCampaignPage  | ✅ Yes         |
| `/audience`      | AudiencePage        | ✅ Yes         |
| `/reports`       | ReportsPage         | ✅ Yes         |
| `/settings`      | SettingsPage        | ✅ Yes         |
| `/api-docs`      | ApiDocPage          | ✅ Yes         |
| `*`              | NotFound            | ❌             |

---

## 👤 User Sidebar Info

User's initials and name are fetched from Supabase Auth metadata and displayed in the sidebar/footer. You can customize this via:

```ts
user?.user_metadata?.full_name
```

---

## 📦 Deploy

Recommended platforms: [Vercel](https://vercel.com/), [Netlify](https://netlify.com/), or [Lovable].

### Deployment Steps:

1. Ensure you have the environment variables set in your deployment platform dashboard:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Run the build command locally to generate production files:

```bash
npm run build
```

3. The production-ready files will be generated in the `dist` folder.

4. Deploy the contents of the `dist` folder to your chosen hosting platform.

### Vercel

- Connect your GitHub repository to Vercel.
- Set the environment variables in the Vercel dashboard.
- Vercel will automatically run `npm run build` and deploy the `dist` folder.

### Netlify

- Connect your GitHub repository to Netlify.
- Set the environment variables in the Netlify dashboard.
- Set the build command to `npm run build`.
- Set the publish directory to `dist`.

---

## 🧪 Future Enhancements

* Campaign scheduling & send via email/SMS API
* Real-time analytics with Supabase Realtime
* Role-based access control (RBAC)
* Admin panel for moderation
* Webhook integration for automation

---

## 📄 License

MIT License. Free to use and modify.

---

## 🙌 Credits

* [Supabase](https://supabase.io/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Lucide Icons](https://lucide.dev/)
* [TanStack Query](https://tanstack.com/query)

---

## 💡 Contributing

Pull requests are welcome! Please open an issue to discuss your idea before starting major changes.

```

---

Let me know if you'd like this deployed on Vercel, need badges (build, license, live preview), or want to include preview images/gifs.
