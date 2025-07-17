# TaskFlow Backend - Deployment Guide

## 🚀 Deploy en Vercel - Updated

### URLs de Producción
- **Backend**: https://taskflow-backend2.vercel.app
- **Frontend**: https://taskflow-frontend-ten.vercel.app

### Variables de Entorno Requeridas

Configura estas variables en tu proyecto de Vercel:

```bash
DATABASE_URL=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]?retryWrites=true&w=majority
JWT_SECRET=[TU_JWT_SECRET_AQUI]
NODE_ENV=production
FRONTEND_URL=https://taskflow-frontend-ten.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[TU_EMAIL]
EMAIL_PASS=[TU_PASSWORD_DE_APLICACION]
```

> ⚠️ **Importante**: Reemplaza los valores entre corchetes con tus credenciales reales en Vercel, no en este archivo.

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