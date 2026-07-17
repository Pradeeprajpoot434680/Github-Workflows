# Full Stack Application Deployment Practical Steps

## Objective

Deploy a complete full-stack application using:

- React Vite Frontend
- Spring Boot Backend
- PostgreSQL Database
- Docker
- Docker Compose
- GitHub Actions
- Docker Hub
- AWS EC2


---

# Phase 1: Application Development

## Step 1: Create Backend Application

### Technologies

- Java 21
- Spring Boot
- Maven
- Spring Data JPA
- PostgreSQL


### Create:

- Entity
- Repository
- Controller
- Service


Example API:

```
POST /users

GET /users
```


---

## Step 2: Configure Database


Install PostgreSQL using Docker:


```bash
docker run \
--name postgres-db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=github_actions \
-p 5432:5432 \
-d postgres:16
```


Check:

```bash
docker ps
```


Access database:

```bash
docker exec -it postgres-db psql -U postgres
```


---

## Step 3: Connect Spring Boot with PostgreSQL


application.yml


```yaml
spring:

 datasource:

  url: jdbc:postgresql://localhost:5432/github_actions

  username: postgres

  password: postgres
```


Run backend:


```bash
mvn spring-boot:run
```


Test:


```
http://localhost:8080/users
```


---

# Phase 2: Frontend Development


## Step 4: Create React Application


Create Vite project:


```bash
npm create vite@latest frontend
```


Install dependencies:


```bash
npm install
```


Install Axios:


```bash
npm install axios
```


---

## Step 5: Connect Frontend with Backend


API URL:


```javascript
http://localhost:8080/users
```


Implement:

- Add User Form
- Get Users
- Display Users


Run frontend:


```bash
npm run dev
```


Open:


```
http://localhost:5173
```


---

# Phase 3: Docker Containerization


## Step 6: Create Backend Dockerfile


Location:


```
GithubActions/Dockerfile
```


Requirements:

- Multi stage build
- Maven build
- JRE runtime


Build:


```bash
docker build \
-t githubactions-backend .
```


Test:


```bash
docker run -p 8080:8080 githubactions-backend
```


---

## Step 7: Create Frontend Dockerfile


Requirements:


- Node build stage
- NGINX runtime stage


Build:


```bash
docker build \
-t githubactions-frontend .
```


Run:


```bash
docker run \
-p 3000:80 \
githubactions-frontend
```


---

# Step 8: Configure NGINX


Create:


```
frontend/nginx.conf
```


Configuration:


```nginx
location / {

try_files $uri /index.html;

}
```


Purpose:

- Support React routing
- Avoid 404 errors


---

# Phase 4: Docker Compose


## Step 9: Create docker-compose.yml


Create services:


```
postgres

backend

frontend
```


Example flow:


```
Frontend

   |

Backend

   |

PostgreSQL
```


Run:


```bash
docker compose up -d
```


Check:


```bash
docker ps
```


---

# Phase 5: Push Project to GitHub


## Step 10: Create Repository


Create GitHub repository.


Initialize:


```bash
git init
```


Add files:


```bash
git add .
```


Commit:


```bash
git commit -m "Full stack application"
```


Push:


```bash
git push origin main
```


---

# Phase 6: GitHub Actions CI


## Step 11: Create Workflow


Create:


```
.github/workflows/ci-cd.yml
```


Workflow performs:


```
Checkout Code

       |

Build Backend

       |

Build Frontend

       |

Docker Build

       |

Docker Push
```


---

## Step 12: Configure GitHub Secrets


Add:


### Docker Hub


```
DOCKER_USERNAME

DOCKER_PASSWORD
```


### AWS


```
EC2_HOST

EC2_USERNAME

EC2_SSH_KEY
```


---

# Phase 7: Docker Hub


## Step 13: Login Docker Hub


GitHub Action:


```
docker/login-action
```


---

## Step 14: Push Images


Backend:


```
username/githubactions-backend
```


Frontend:


```
username/githubactions-frontend
```


Verify on Docker Hub.


---

# Phase 8: AWS EC2 Deployment


## Step 15: Create EC2 Instance


Requirements:


- Ubuntu Server
- Open ports:
    - 22 SSH
    - 80 HTTP
    - 8080 Backend


---

## Step 16: Connect EC2


```bash
ssh -i key.pem ubuntu@EC2_IP
```


---

## Step 17: Install Docker


Verify:


```bash
docker --version
```


Install compose:


```bash
docker compose version
```


---

# Step 18: Clone Deployment Files


Create:


```
DeployFullApp
```


Add:


```
docker-compose.yml
```


---

# Phase 9: Continuous Deployment


## Step 19: Add Deploy Job


GitHub Actions:


```
Build

 |

Push Docker Hub

 |

SSH EC2

 |

docker compose pull

 |

docker compose up -d
```


---

# Step 20: Verify Deployment


EC2:


```bash
docker ps
```


Expected:


```
frontend container

backend container

postgres container
```


---

# Final Application Flow


```
Developer

    |

    ↓

Git Push

    |

    ↓

GitHub Actions

    |

    ├── Build Application

    ├── Build Docker Images

    ├── Push Docker Hub

    |

    ↓

AWS EC2

    |

    ├── Pull Images

    ├── Start Containers

    |

    ↓

Live Application
```


---

# Important Commands


## Docker


List containers:


```bash
docker ps
```


List images:


```bash
docker images
```


Remove container:


```bash
docker rm -f container_name
```


Stop compose:


```bash
docker compose down
```


Start compose:


```bash
docker compose up -d
```


View logs:


```bash
docker logs container_name
```


---

# Common Issues and Solutions


## PostgreSQL Port Already Used


Check:


```bash
docker ps
```


Remove old container:


```bash
docker rm -f postgres-db
```


---

## PostgreSQL Reserved Table Name


Problem:


```
user
```


Solution:


Use:


```
users
```


---

## CORS Error


Allow frontend origin:


```
http://localhost:3000
```


---

## SSH Authentication Error


Check:


- Correct PEM file
- Complete private key
- Correct username


---

## Docker Compose Error


Check:


```bash
docker compose version
```


---

# Completion Checklist


## Application

✅ Backend Created  
✅ Frontend Created  
✅ Database Connected  
✅ APIs Working  


## Docker

✅ Backend Container  
✅ Frontend Container  
✅ PostgreSQL Container  
✅ Docker Compose  


## CI/CD

✅ GitHub Repository  
✅ GitHub Actions  
✅ Docker Hub  
✅ AWS EC2  
✅ Auto Deployment  


---

# Final Outcome

A production-style full-stack deployment pipeline is created where every code push automatically:

1. Builds the application
2. Creates Docker images
3. Pushes images to Docker Hub
4. Deploys the latest version to AWS EC2