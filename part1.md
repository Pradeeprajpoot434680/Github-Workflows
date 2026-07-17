# Full Stack Application Deployment

# Part 1: Application Development and Containerization

---

# Project Overview

This project is a full-stack application containing:

- React Vite Frontend
- Spring Boot Backend
- PostgreSQL Database
- Docker Containers
- Docker Compose

The goal is to containerize the complete application so it can run anywhere.

---

# Application Architecture

```
                 User
                  |
                  |
              NGINX
                  |
                  |
          React Frontend Container
                  |
                  |
          Spring Boot Backend Container
                  |
                  |
        PostgreSQL Database Container
```

---

# Project Structure

```
Github-Workflows/

│
├── frontend/
│   │
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
│
├── GithubActions/
│   │
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
│
└── docker-compose.yml
```

---

# Backend Application

## Technology Stack

- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven


---

# Database Setup

PostgreSQL is running inside Docker.

Create PostgreSQL container:

```bash
docker run \
--name postgres-db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=github_actions \
-p 5432:5432 \
-d postgres:16
```

---

## PostgreSQL Container Explanation

| Option | Meaning |
|---|---|
| postgres:16 | PostgreSQL Docker Image |
| POSTGRES_USER | Database username |
| POSTGRES_PASSWORD | Database password |
| POSTGRES_DB | Database name |
| -p 5432:5432 | Port mapping |


---

# Access PostgreSQL Container


Check running containers:

```bash
docker ps
```


Enter PostgreSQL:

```bash
docker exec -it postgres-db psql -U postgres
```


List databases:

```sql
\l
```


Connect database:

```sql
\c github_actions
```


Show tables:

```sql
\dt
```

---

# Spring Boot Database Configuration


application.yml

```yaml
spring:

  application:
    name: GithubActions


  datasource:

    url: jdbc:postgresql://localhost:5432/github_actions

    username: postgres

    password: postgres

    driver-class-name: org.postgresql.Driver


  jpa:

    hibernate:
      ddl-auto: update
```

---

# User Entity


```java
@Entity
@Data
@Table(name="users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String username;


    private String email;


    private String password;

}
```


Note:

`users` table name is used because `user` is a reserved keyword in PostgreSQL.

---

# Backend APIs


## Add User

Method:

```
POST /users
```


Request:

```json
{
 "username":"Pradeep",
 "email":"test@gmail.com",
 "password":"12345"
}
```


---

## Get All Users


Method:

```
GET /users
```


Response:

```json
[
 {
  "id":1,
  "username":"Pradeep",
  "email":"test@gmail.com",
  "password":"12345"
 }
]
```

---

# CORS Configuration


Frontend and backend run on different ports.


Frontend:

```
localhost:3000
```


Backend:

```
localhost:8080
```


CORS allows communication between them.


Example:


```java
@Configuration
public class CorsConfig {


@Bean
public WebMvcConfigurer corsConfigurer(){

return new WebMvcConfigurer(){


@Override
public void addCorsMappings(CorsRegistry registry){

registry.addMapping("/**")
.allowedOrigins("http://localhost:3000")
.allowedMethods("*")
.allowedHeaders("*");

}

};

}

}
```

---

# Frontend Application


Technology:

- React
- Vite
- Axios


Features:

- Add User Form
- Fetch Users
- Display Users


API:

```javascript
const API="http://localhost:8080/users";
```


POST Request:

```javascript
axios.post(API,form)
```


GET Request:

```javascript
axios.get(API)
```

---

# Containerization

Containerization means packaging an application with all required dependencies into a Docker image.

Benefits:

- Same environment everywhere
- Easy deployment
- Isolation
- Scalability


---

# Backend Dockerization


Dockerfile:

```
GithubActions/Dockerfile
```


```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build


WORKDIR /app


COPY pom.xml .


RUN mvn dependency:go-offline


COPY . .


RUN mvn clean package -DskipTests



FROM eclipse-temurin:21-jre


WORKDIR /app


COPY --from=build /app/target/*.jar app.jar


EXPOSE 8080


ENTRYPOINT ["java","-jar","app.jar"]
```

---

# Multi Stage Docker Build


## Stage 1

```
Maven Image

      |
      |
Compile Application

      |
      |
Create JAR
```


## Stage 2


```
JRE Image

      |
      |
Copy JAR

      |
      |
Run Application
```


Advantages:

- Smaller image
- Faster startup
- Less attack surface


---

# Frontend Dockerization


React build flow:


```
React Source

      |

npm install

      |

npm run build

      |

Static Files

      |

NGINX

      |

Docker Container
```

---

# Frontend Dockerfile


```dockerfile
FROM node:22-alpine AS build


WORKDIR /app


COPY package*.json .


RUN npm install


COPY . .


RUN npm run build



FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80


CMD ["nginx","-g","daemon off;"]
```

---

# NGINX Configuration


File:

```
frontend/nginx.conf
```


```nginx
server {


listen 80;


server_name localhost;


root /usr/share/nginx/html;


index index.html;



location / {


try_files $uri /index.html;


}


}
```

---

# Why try_files?


React applications use client-side routing.


Example:

```
example.com/profile
```


NGINX checks:

```
/usr/share/nginx/html/profile
```


File does not exist.


Without try_files:

```
404 Not Found
```


With:

```nginx
try_files $uri /index.html;
```


NGINX returns:

```
index.html
```


React Router handles the route.

---

# Building Docker Images


Backend:

```bash
docker build \
-t githubactions-backend .
```


Frontend:

```bash
docker build \
-t githubactions-frontend .
```


Check images:

```bash
docker images
```

---

# Docker Compose


Docker Compose manages multiple containers together.


Containers:

```
Frontend

Backend

PostgreSQL
```


They communicate using Docker network.

---

# docker-compose.yml


```yaml
services:


 postgres:

  image: postgres:16

  environment:

    POSTGRES_USER: postgres

    POSTGRES_PASSWORD: postgres

    POSTGRES_DB: github_actions


  ports:

    - "5433:5432"



 backend:


  image: githubactions-backend


  depends_on:

    - postgres


  ports:

    - "8080:8080"



 frontend:


  image: githubactions-frontend


  depends_on:

    - backend


  ports:

    - "3000:80"
```

---

# Running Complete Application


Start containers:

```bash
docker compose up -d
```


Check:

```bash
docker ps
```


Application URLs:


Frontend:

```
http://localhost:3000
```


Backend:

```
http://localhost:8080/users
```


Database:

```
PostgreSQL Docker Container
```

---

# Completed Phase 1


Completed:

✅ Spring Boot Application  
✅ PostgreSQL Database  
✅ React Frontend  
✅ REST APIs  
✅ CORS Configuration  
✅ Backend Docker Image  
✅ Frontend Docker Image  
✅ NGINX Setup  
✅ Docker Compose  


Next Part:

# Part 2 - CI/CD Deployment

Includes:

- GitHub Repository Setup
- GitHub Actions Workflow
- Docker Hub Push
- AWS EC2 Setup
- SSH Deployment
- Automatic Deployment