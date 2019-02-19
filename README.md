## How to Run The Project

### Setting up MYSQL with Docker
1. Make sure you have Docker installed on your machine
2. Run Docker
3. Run this command on your CLI to pull mysql-alpine for the docker `docker pull quay.io/perriea/alpine-mysql:1.0`
4.  Go to the project folder and run `docker run -d -p 3306:3306 --env-file .env quay.io/perriea/alpine-mysql:1.0`

### MYSQL Settings (as in .env)
```
MYSQL_DATABASE=app
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=app
MYSQL_PASSWORD=app
MYSQL_USER_MONITORING=monitoring
MYSQL_PASSWORD_MONITORING=monitoring
```

### Running the project
1.  Open the project folder and run `npm install` in the project folder
2.  Run `npm start`. The server will run at port 3000
