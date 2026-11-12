[README.md](https://github.com/user-attachments/files/34744445/README.md)
# ARCH Softwares website

A responsive company website for ARCH Softwares with a work portfolio, product catalogue, enquiry form, customer review submission/moderation and a password-protected admin dashboard.

## Included

- Public homepage, About, Services, Work, Products, Reviews and Contact sections.
- Responsive layout for desktop, tablet and mobile.
- WhatsApp, phone and email contact links using the business details supplied.
- Portfolio filters and project cards.
- Product catalogue with WhatsApp enquiry links.
- Customer enquiries saved to SQLite.
- Customer reviews saved as pending until an administrator approves them.
- Admin dashboard for projects, products, enquiries and reviews.
- Image uploads (JPG, PNG, WEBP and GIF; maximum 4 MB).
- Password hashes, session-based authentication, rate limits, security headers and input checks.
- The included ARCH logo is in `public/assets/arch-softwares-logo.png`.

## Run on your Windows PC

1. Install Node.js 20 or newer from https://nodejs.org/.
2. Extract this ZIP to a folder, for example `C:\ARCH-Softwares`.
3. Open that folder in File Explorer.
4. Click the folder address bar, type `cmd`, and press Enter.
5. Run:

   ```bash
   npm install
   ```

6. Make a copy of `.env.example` and name the copy `.env`.
7. Open `.env` in Notepad. Change `SESSION_SECRET` to a long random string and change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to your own private admin login. Do not share or upload `.env`.
8. Run:

   ```bash
   npm start
   ```

9. Open `http://localhost:3000` in your browser.
10. Open `http://localhost:3000/admin` to sign in with the email and password you placed in `.env`.

The database is created automatically in the `data` folder the first time the server starts. Keep that folder when backing up or moving the site; it contains your projects, products, enquiries, reviews and login sessions.

## Important before publishing

- Set a strong unique `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the hosting provider's environment-variable settings.
- Set `NODE_ENV=production` and `TRUST_PROXY=true` when using a trusted HTTPS reverse proxy such as Render.
- Use HTTPS in production.
- This starter uses SQLite and local image uploads. Choose hosting with a persistent disk/volume mounted so the `data` and `public/uploads` folders survive redeployments. A temporary filesystem can erase the database and uploaded images.
- Back up the `data/arch.sqlite` database and `public/uploads` folder regularly.
- Replace the clearly labelled sample/demo portfolio entries with genuine work before presenting them as completed projects. No customer reviews are preloaded.
- The contact form stores enquiries in the admin dashboard; it does not send email notifications yet. The public email link is available for direct contact.

## Deploy using GitHub and Render (one straightforward option)

1. Create a new GitHub repository, for example `arch-softwares-website`.
2. Extract the ZIP. In the repository's browser upload page, upload the project files and folders. If GitHub reports too many files, upload the contents in smaller batches. Do not upload `node_modules`, `.env`, or the `data` folder.
3. In Render, create a new **Web Service** and connect the GitHub repository.
4. Set the build command to `npm install` and the start command to `npm start`.
5. Add environment variables: `NODE_ENV=production`, `TRUST_PROXY=true`, `SESSION_SECRET` (a long random secret), `ADMIN_EMAIL` and `ADMIN_PASSWORD` (a strong password).
6. Add a persistent disk and mount it at the project path so both `data/` and `public/uploads/` persist. If your host cannot persist both paths on one disk, configure storage paths before launch or move uploads to object storage.
7. Deploy, open the site URL and test the contact form, review submission and admin login.

## Admin dashboard guide

- **Projects:** Add/edit/delete portfolio entries. Use categories exactly as `Websites`, `Web Applications` or `E-commerce` to match the public filters (other categories can still be saved but won't have a dedicated filter button).
- **Products:** Add/edit/delete products. The Enquire button opens WhatsApp with a product-specific message.
- **Enquiries:** Read customer messages and change their status to New, In progress or Completed.
- **Reviews:** Approve a review to publish it on the public website, unpublish it or delete it.

## Notes

This is a working self-hosted starter website, not a managed hosting account. You are responsible for deploying it, setting production credentials and choosing persistent hosting. The first launch seeds three clearly described demonstration portfolio items; edit or remove them in the admin dashboard. The product catalogue starts empty.
