# groupomania back-end

## Project setup
```
npm install

```
### Create images directory
```
mkdir public
cd public
mkdir images
cd ../

Add an avatar default image named 'avatar_default.png' in public/images/ 
```

#### Create environment variables
```
type nul > .env

Add the following variables in .env:
-   DB_USER = 'mysql_username'  replace mysql_username by your mysql username 
-   DB_PASSWORD = 'mysql_password' replace mysql_password by your mysql password
-   DB_NAME = db_groupomania

!!! Don't forget to remove ''

```
##### Install Mysql
```
Install Mysql and import 'db_groupomania.sql'

```
###### Run the server
```
node server

OR if you use nodemon

nodemon server 
```