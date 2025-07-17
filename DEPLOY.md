# TaskFlow Backend - Deployment Guide

## 🚀 Deploy en Vercel

### URLs de Producción
- **Backend**: https://taskflow-backend2.vercel.app
- **Frontend**: https://taskflow-frontend-ten.vercel.app

### Variables de Entorno Requeridas

Configura estas variables en tu proyecto de Vercel:

```bash
DATABASE_URL=mongodb+srv://firedevelopcom:sg9WEZffh5MmvpwM@taskflow.cwxcjwk.mongodb.net/taskflow?retryWrites=true&w=majority&appName=TaskFlow
JWT_SECRET=6f15011d07d2642dde9be211602a11f7c6972accfcc3997439c75099f233f119
NODE_ENV=production
FRONTEND_URL=https://taskflow-frontend-ten.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### Endpoints Disponibles

- `https://taskflow-backend2.vercel.app/api/auth/create-account`
- `https://taskflow-backend2.vercel.app/api/auth/login`
- `https://taskflow-backend2.vercel.app/api/projects/*`

### Usuarios de Prueba

```bash
Email: admin@taskflow.com
Password: admin123

Email: test@test.com  
Password: 12345678
```