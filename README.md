# FileSharing project using IPFS, NextJs and .NET for secure and decentralized storage.

FileShare is a modern web application that enables secure file sharing using IPFS (InterPlanetary File System) for decentralized storage.

![image](https://github.com/user-attachments/assets/dfb5a74b-efa2-4892-b5bd-2ea10a755bbb)


---

## Features
- 🔐 **Secure user authentication** with JWT tokens and RSA encryption  
- 📁 **Decentralized file storage** using IPFS  
- 🔄 **File upload** with progress tracking  
- 📋 **File metadata management**  
- ⏱️ **Automatic file expiration**  

---

## Technology Stack

- **Backend:** ASP.NET Core 8.0  
- **Frontend:** Next.js 15.1  
- **Database:** PostgreSQL  
- **Storage:** IPFS  
- **Authentication:** JWT with RSA encryption  
- **API Documentation:** Swagger/OpenAPI  

---

## Prerequisites

Before running the application, ensure you have the following installed:

- .NET 8.0 SDK  
- Node.js (Latest LTS)  
- PostgreSQL  
- IPFS daemon  
- Visual Studio 2022 or VS Code  

---

## Installation

### Clone the Repository
```sh
git clone https://github.com/your-repo/FileShare.git
cd FileShare
```

### Backend Setup
1. Generate an RSA key for JWT signing.  
2. Configure `appsettings.Development.json`.  

### Frontend Setup
Follow the setup instructions for Next.js in the `frontend` directory.

---

## Running the Application

### Start Services
1. Start the **IPFS daemon**.  
2. Start the **backend**:  
   ```sh
   cd backend
   dotnet run
   ```
3. Start the **frontend**:  
   ```sh
   cd frontend
   npm run dev
   ```

The application will be available at:
- **Frontend:** [http://localhost:3000](http://localhost:3000)  
- **Backend API:** [http://localhost:8000](http://localhost:8000)  
- **Swagger Documentation:** [http://localhost:8000/swagger](http://localhost:8000/swagger)  

---

## API Documentation

The API is documented using **Swagger**. Key endpoints include:

### **File Operations**
- `POST /api/files/upload` - Upload a file  
- `GET /api/files/retrieve/{cid}` - Download a file  
- `DELETE /api/files/delete/{cid}` - Delete a file  
- `GET /api/files/list` - List user's files  

### **Authentication**
- `POST /api/auth/login` - User login  
- `POST /api/auth/register` - User registration  

For detailed API documentation, visit the Swagger UI when running the application.

---

## Security Features

- 🔑 **JWT authentication** with RSA signing  
- 🔒 **File access control** based on user ownership  
- 🛡️ **File type validation**  
- 📏 **File size limits** (5MB per file)  
- 🌍 **CORS configuration**  
- 🔐 **Secure password requirements**  

---

## Screenshots
![image](https://github.com/user-attachments/assets/214005e6-9e5a-4045-a11c-8847f57cd124)
![image](https://github.com/user-attachments/assets/609649a6-c17c-4893-bf91-110ceeb902ff)


