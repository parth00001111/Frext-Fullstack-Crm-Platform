# Frext CRM: Render deployment

Frontend React + Tailwind build aur Express API ek hi Render URL se serve hote hain. MongoDB Atlas database alag rahega.

## 1. Code GitHub par bhejo

Project root mein:

```powershell
git add .gitignore .dockerignore Dockerfile render.yaml DEPLOYMENT.md backend frontend
git commit -m "Prepare CRM for Render deployment"
git push origin main
```

`.env` commit mat karo. Docker build bhi environment files ko exclude karta hai.

## 2. MongoDB Atlas taiyar karo

- Existing cluster use karo, ya Atlas mein cluster banao.
- Database Access mein database user banao; use CRM database ke liye read/write access do.
- Connect > Drivers se connection string lo. Username, URL-encoded password aur database name fill karo.
- Existing `backend/.env` mein `MONGO_URL` hai toh uski value Render ke secret field mein paste kar sakte ho. Chat ya GitHub mein paste mat karo.

## 3. Render Blueprint banao

- https://dashboard.render.com par login karo.
- New > Blueprint select karo aur GitHub connect karo.
- `parth00001111/Frext-Fullstack-Crm-Platform` repo aur `main` branch choose karo.
- Root mein `render.yaml` detect hoga. Blueprint ko ek naam do.
- `MONGO_URL` secret field mein Atlas URI paste karo.
- Config review karke Deploy Blueprint click karo. `JWT_SECRET` automatically generate hoga.

Config: Docker runtime, Singapore region, Free instance, `/healthz` health check. Frontend/backend ke liye separate URL ya build command enter karna zaroori nahi.

## 4. Atlas ko Render se connection allow karo

- Render web service mein Connect > Outbound se outbound IP ranges copy karo.
- Atlas > Network Access mein woh ranges add karo.
- Agar initial deploy database access ke bina fail hua ho, Render se Manual Deploy > Deploy latest commit karo.

## 5. Live verification aur initial account

- Render ka assigned `https://...onrender.com` URL kholo.
- `/healthz` par HTTP 200 aur `{"status":"ok"}` aana chahiye.
- `/login` direct open/refresh karke dekho.
- Agar existing database mein account hai toh login karo.
- Agar initial account chahiye: Render Environment mein `ALLOW_SIGNUP=true` karke redeploy karo; turant `/signup` se apna account banao; phir `ALLOW_SIGNUP=false` karke redeploy karo.
- Signup enabled rehne par koi bhi Admin role select kar sakta hai, isliye ise sirf controlled initial setup ke liye temporarily enable karo.
- Login ke baad customer, deal aur task workflows verify karo.

## Local production check

Requirements: Bun 1.3.14 and Node.js 22+.

```powershell
cd frontend
bun install --frozen-lockfile
bun run build
cd ../backend
npm.cmd ci
bun run build
$env:NODE_ENV='production'
$env:PORT='5000'
npm.cmd start
```

Backend `.env` mein `MONGO_URL` aur `JWT_SECRET` required hain. Local development ke liye existing backend `dev` aur frontend `dev` commands use kar sakte ho. Production API URL `/api/v1` hota hai.

## Troubleshooting

- Database/startup failure: `MONGO_URL`, Atlas database user/password aur Render outbound IP allowlist check karo.
- 403 on signup: default `ALLOW_SIGNUP=false` hai.
- Linux import errors: tracked backend folders `Controllers`, `Models`, `Routes`, `Validation` capitalized hain; imports ka case wahi hona chahiye.
- Free Render service idle hone par sleep kar sakti hai; next request slow ho sakti hai. Always-on usage ke liye paid instance select karna padega.

Official references:
- https://render.com/docs/infrastructure-as-code
- https://render.com/docs/docker
- https://render.com/docs/outbound-ip-addresses
- https://render.com/docs/free
- https://www.mongodb.com/docs/atlas/security/ip-access-list/

Local verification on this system passed using MONGO_DNS_SERVERS=8.8.8.8,1.1.1.1. Set this environment variable only if your local DNS refuses Atlas SRV lookups; Render uses its default resolver unless explicitly overridden.
