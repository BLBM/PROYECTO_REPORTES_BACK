FROM node:18.16-alpine

WORKDIR /app

# Copiar package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que tu app se ejecuta
EXPOSE 7007

# Comando para iniciar la aplicación
CMD ["npm", "start"]
