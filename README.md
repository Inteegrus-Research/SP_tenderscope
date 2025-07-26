# 🗂️ TenderScope — Smart Tender Management Platform

TenderScope is a full-stack web app for posting, viewing, and registering for tenders. It offers an intuitive interface for organizations to publish tenders and for applicants to explore them seamlessly.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose ODM

## ✨ Features

- Post tenders with title, description, deadline & requirements  
- Browse tenders in a centralized view  
- View full tender details  
- *(Planned)* Registration system, edit page, advanced filters & role access

## 📁 Folder Structure

```
project/
├── client/       # React frontend
│   └── src/pages/  # Home, TenderDetail, EditTender (planned)
├── server/       # Node backend
│   ├── routes/     # API endpoints
│   ├── controllers/ # Logic handlers
│   └── models/     # MongoDB schemas
```

## 🛠️ Setup Instructions

```bash
git clone https://github.com/your-username/tenderscope.git

# Install client
cd project/client
npm install

# Install server
cd ../server
npm install

# Set environment variables
echo "PORT=5000\nMONGO_URI=your_mongodb_uri" > .env

# Run client and server in separate terminals
cd client
npm run dev

cd ../server
npm start
```

## 👩‍💻 Contributor

Built by **[Your Name]** — focused on efficient backend structuring and clean UI delivery.

## 📄 License

Licensed under the MIT License.


<img width="1800" height="921" alt="Screenshot 2025-07-26 053545" src="https://github.com/user-attachments/assets/f953a0c4-f306-4e78-862f-82c0a38081e0" />
