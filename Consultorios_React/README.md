## Consultorios – Frontend (React / Vite)

### Description
Single Page Application for a medical appointments platform with three roles:
- ADMIN: manage users, approve professionals, and view/edit professionals’ calendars.
- PROFESSIONAL: manage personal profile, agenda (create/update/cancel appointments), and export agenda.
- PATIENT: register, confirm email, view and cancel own appointments.

### Technologies
- React 18 + TypeScript
- Vite (dev server/build)
- React Router
- Fetch API
- CSS styles (App.css and page-specific styles)

### Requirements
- Node.js 18+
- npm 9+

### Installation
1. Clone the repository
   - `git clone <your-repo-url>`
2. Go to frontend folder
   - `cd Consultorios_React`
3. Install dependencies
   - `npm install`
4. Configure API base URL (dev): create `.env.local` with
   - `VITE_API_BASE_URL=http://localhost:8080`

### Run
- Development: `npm run dev` (default: http://localhost:5173)
- Production build: `npm run build`
- Preview built app: `npm run preview`

Login persists JWT and roles in `localStorage` to render role-based menus.

### Deployment
1. Build the app: `npm run build` (outputs to `dist/`)
2. Serve `dist/` with a static server (Nginx, Apache, CDN, or `vite preview`)
3. Ensure the backend URL is provided via `VITE_API_BASE_URL`

### Contributions
Contributions are welcome!
1. Fork the repository
2. Create a branch: `git checkout -b feature/NewFeature`
3. Commit: `git commit -m "feat: add NewFeature"`
4. Push: `git push origin feature/NewFeature`
5. Open a Pull Request

