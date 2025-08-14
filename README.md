# 🌲 YelpCamp – Campground Listing & Review App

YelpCamp is a full-stack web application where users can browse, create, and review campgrounds from around the world.  
It features authentication, interactive maps, image uploads, and modern responsive UI styling.

Live at: https://yelpcamp-j28d.onrender.com

## 🚀 Features
- 🏕 **Campground CRUD** – Create, read, update, and delete campgrounds
- 📝 **Reviews** – Add, edit, and delete campground reviews
- 🖼 **Image Uploads** – Store images using Cloudinary
- 🗺 **Interactive Map** – Powered by Mapbox for location display
- 🔐 **Authentication** – Secure login & signup using Passport.js
- 🛡 **Security** – MongoDB injection sanitization, data validation, and more
- 📱 **Responsive Design** – Looks great on mobile & desktop
- 🔄 **Infinite Scrolling** – Seamlessly load more campgrounds
- 💬 **Flash Messages** – User-friendly feedback for actions

## 🛠 Tech Stack
**Frontend**
- EJS (templating)
- Bootstrap 5 + Custom CSS
- Mapbox GL JS

**Backend**
- Node.js / Express 5
- MongoDB Atlas (Mongoose ODM)
- Passport.js (authentication)
- Cloudinary (image hosting)
- Multer (file uploads)

**Security**
- Helmet
- express-mongo-sanitize (custom middleware for Express 5)
- Joi (server-side validation)

---

## 📦 Installation

### 1️ Clone the repository
git clone https://github.com/yourusername/yelpcamp.git
cd yelpcamp

### 2 Install dependencies
npm install

### Environment Variables

Create a `.env` file in the root directory of the project and add the following:

```env
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yelpcamp
MAPBOX_TOKEN=your_mapbox_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
SESSION_SECRET=your_secret

