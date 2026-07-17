# Full Stack Application Deployment

# Part 2: CI/CD Deployment

---

# Overview

In Part 1, the complete application was containerized:

- React Frontend
- Spring Boot Backend
- PostgreSQL Database
- Docker Images
- Docker Compose


In this phase, we automate deployment using:

- GitHub Repository
- GitHub Actions
- Docker Hub
- AWS EC2
- SSH Deployment


Final CI/CD Architecture:

```
Developer

    |
    |
    ↓

Git Push

    |
    |
    ↓

GitHub Repository

    |
    |
    ↓

GitHub Actions

    |
    |
    ├───────────────┐
    |               |
    ↓               ↓

Build Backend   Build Frontend

    |               |
    └───────┬───────┘
            |
            ↓

      Docker Build

            |
            ↓

      Docker Hub

            |
            ↓

        AWS EC2

            |
            ↓

   Docker Compose Deployment

            |
            ↓

     Running Application
```

---

# 1. GitHub Repository Setup


Project was pushed to GitHub.


Repository structure:


```
Github-Workflows/


│
├── frontend/
│
├── GithubActions/
│
├── docker-compose.yml
│
└── .github/
    |
    └── workflows/
        |
        └── ci-cd.yml
```


---

# 2. GitHub Actions Introduction


GitHub Actions is used to automate:

- Building application
- Running tests
- Creating Docker images
- Uploading images
- Deploying application


Workflow location:


```
.github/workflows/
```


Example:

```
.github/workflows/deploy.yml
```

---

# 3. CI Pipeline


CI means:

Continuous Integration


Every push to main branch triggers the workflow.


Flow:


```
Code Push

    |

Checkout Repository

    |

Build Backend

    |

Build Frontend

    |

Create Docker Images

    |

Push Images
```

---

# 4. GitHub Actions Workflow


File:

```
.github/workflows/ci-cd.yml
```


```yaml
name: Full Stack CI/CD


on:

  push:

    branches:

      - main



jobs:


  build:


    runs-on: ubuntu-latest



    steps:


      - name: Checkout Code

        uses: actions/checkout@v4



      - name: Setup Java

        uses: actions/setup-java@v4

        with:

          java-version: "21"

          distribution: temurin



      - name: Build Backend

        working-directory: GithubActions

        run: mvn clean package -DskipTests



      - name: Setup Node

        uses: actions/setup-node@v4

        with:

          node-version: "22"



      - name: Build Frontend

        working-directory: frontend

        run: |

          npm install

          npm run build
```

---

# 5. Docker Image Build in GitHub Actions


After successful application build:


Backend image:

```bash
docker build \
-t username/githubactions-backend:latest \
./GithubActions
```


Frontend image:

```bash
docker build \
-t username/githubactions-frontend:latest \
./frontend
```


---

# 6. Docker Hub Setup


Docker Hub stores Docker images.


Images:

```
Docker Hub


username/githubactions-backend

username/githubactions-frontend
```


GitHub Actions pushes images here.


---

# 7. Docker Hub Secrets


GitHub repository secrets:


```
Settings

   ↓

Secrets and Variables

   ↓

Actions

```


Added:


## Docker Username


```
DOCKER_USERNAME
```


Value:

```
Docker Hub username
```


---

## Docker Password


```
DOCKER_PASSWORD
```


Value:

```
Docker Hub password/token
```


---

# 8. Docker Hub Login


GitHub Action:


```yaml
- name: Login Docker Hub

  uses: docker/login-action@v3

  with:

    username: ${{ secrets.DOCKER_USERNAME }}

    password: ${{ secrets.DOCKER_PASSWORD }}
```


---

# 9. Push Images to Docker Hub


Backend:

```yaml
docker push username/githubactions-backend:latest
```


Frontend:

```yaml
docker push username/githubactions-frontend:latest
```


After push:


```
Docker Hub

    |

    |

githubactions-backend:latest

githubactions-frontend:latest

```

---

# 10. AWS EC2 Setup


Created an Ubuntu EC2 instance.


Requirements:


Installed:

- Docker
- Docker Compose


Verify Docker:


```bash
docker --version
```


Verify Compose:


```bash
docker compose version
```


---

# 11. EC2 SSH Connection


Private key:


```
full-github-action-deployment.pem
```


Permission:


```bash
chmod 400 full-github-action-deployment.pem
```


Connect:


```bash
ssh -i full-github-action-deployment.pem ubuntu@EC2_PUBLIC_IP
```


Example:


```bash
ssh -i full-github-action-deployment.pem ubuntu@ec2-13-207-150-137.ap-south-1.compute.amazonaws.com
```


---

# 12. EC2 Deployment Folder


EC2 contains:


```
DeployFullApp/


│
├── docker-compose.yml
│
└── deployment files
```


---

# 13. Docker Compose on EC2


EC2 docker-compose.yml:


```yaml
services:


 postgres:

  image: postgres:16


  environment:

    POSTGRES_USER: postgres

    POSTGRES_PASSWORD: postgres

    POSTGRES_DB: github_actions



 backend:


  image: username/githubactions-backend:latest


  ports:

    - "8080:8080"



 frontend:


  image: username/githubactions-frontend:latest


  ports:

    - "80:80"
```


---

# 14. GitHub Secrets for AWS


Added secrets:


## EC2_HOST


```
EC2 public DNS
```


Example:


```
ec2-13-207-150-137.ap-south-1.compute.amazonaws.com
```


---

## EC2_USERNAME


```
ubuntu
```


---

## EC2_SSH_KEY


Complete private key:


```
-----BEGIN RSA PRIVATE KEY-----

PRIVATE KEY CONTENT

-----END RSA PRIVATE KEY-----
```


---

# 15. Continuous Deployment


After Docker images are pushed:


GitHub Actions connects to EC2 using SSH.


Deployment steps:


```
SSH into EC2

      |

Go to project folder

      |

Pull latest Docker images

      |

Restart containers

      |

Application Updated

```


---

# 16. Deploy Job


GitHub Action:


```yaml
deploy:


 runs-on: ubuntu-latest


 needs: build



 steps:


 - name: Deploy to EC2


   uses: appleboy/ssh-action@v1.0.3


   with:


    host: ${{ secrets.EC2_HOST }}


    username: ${{ secrets.EC2_USERNAME }}


    key: ${{ secrets.EC2_SSH_KEY }}



    script: |


      cd DeployFullApp


      docker compose pull


      docker compose up -d


      docker image prune -f
```


---

# 17. Complete CI/CD Flow


```
Developer

    |

    ↓

git push


    |

    ↓

GitHub Actions


    |

    ├── Maven Build

    |

    ├── React Build

    |

    ├── Docker Build

    |

    ├── Push Docker Hub


    |

    ↓


SSH Connection


    |

    ↓


AWS EC2


    |

    ├── docker compose pull

    |

    └── docker compose up -d


    |

    ↓


Production Application
```

---

# 18. Final Deployment


Running containers on EC2:


```
docker ps
```


Example:


```
CONTAINER

frontend

backend

postgres
```


Application:


Frontend:

```
http://EC2_PUBLIC_IP
```


Backend:

```
http://EC2_PUBLIC_IP:8080/users
```


---

# Completed Project


## Development

✅ Spring Boot Backend  
✅ React Frontend  
✅ PostgreSQL Database  


## Containerization

✅ Backend Dockerfile  
✅ Frontend Dockerfile  
✅ NGINX Configuration  
✅ Docker Compose  


## CI/CD

✅ GitHub Repository  
✅ GitHub Actions  
✅ Maven Build  
✅ React Build  
✅ Docker Image Build  
✅ Docker Hub Push  
✅ AWS EC2 Deployment  
✅ Automatic Deployment  


---

# Final Result


A complete automated deployment pipeline:

```
Code Commit

      ↓

GitHub Actions

      ↓

Docker Images

      ↓

Docker Hub

      ↓

AWS EC2

      ↓

Live Application
```
