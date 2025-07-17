# TaskFlow Backend - Deployment Guide

## 🚀 Deploy en Vercel

### Variables de Entorno Requeridas

Configura estas variables en tu proyecto de Vercel:

```bash
DATABASE_URL=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_super_secreto
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### Pasos para Deploy

1. **Conectar con GitHub**: Conecta tu repositorio en Vercel
2. **Configurar Variables**: Agrega las variables de entorno
3. **Deploy**: Vercel desplegará automáticamente

### Endpoints Disponibles

Una vez desplegado, tu API estará disponible en:
- `https://tu-backend.vercel.app/api/auth/*`
- `https://tu-backend.vercel.app/api/projects/*`

### Desarrollo Local

```bash
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:4001`
