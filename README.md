# Expense Management System (Django + React)

A full-stack **Expense Management System** built with **Django REST Framework** (backend) and **React** (frontend).  
The application allows users to track and visualize daily expenses, download expense reports, and view graphical insights.  
The project is fully containerized using **Docker**, deployed on **Minikube (Kubernetes)**, and automated with **Jenkins CI/CD**.

---

## 🚀 Features

### 📊 Expense Tracking
- Add, update, delete, and categorize expenses  
- Monthly and category-wise expense filters  

### 📈 Graphical Expense Overview
- Pie chart of expenses by category  
- Monthly expense trend line chart  
- Bar chart comparison  

### 📄 Report Downloads
- Export expenses in **PDF** or **CSV** format  

### 🖥️ Full-Stack Architecture
- **Django REST Framework** backend  
- **React** frontend with a clean UI  

### 🐳 Dockerized Deployment
- Separate Dockerfiles for backend and frontend  
- Multi-container setup using Docker  

### ☸️ Kubernetes (Minikube)
- Deployment and service YAML files  
- LoadBalancer / NodePort support  

### 🔁 CI/CD with Jenkins
- Automated build and deployment pipeline  
- Docker image push to Docker Hub  
- Kubernetes auto-deploy after successful build  

---

## 🛠️ Tech Stack

### **Frontend**
- React  
- Axios
  
### **Backend**
- Django  
- Django REST Framework  
- PostgreSQL / MySQL / SQLite  

### **DevOps**
- Docker & Docker Hub  
- Kubernetes (Minikube)  
- Jenkins CI/CD  

---

## 📦 Installation & Setup
pip install -r requirements.txt (For Python pip modules)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/expense-management-system.gi
