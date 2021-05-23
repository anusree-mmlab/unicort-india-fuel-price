#Installation Steps

#1. **`npm install`** for both frontend and backend
#2. use the **`india_fuel_price.sql`** to create Mysql Schema for databse **"india_fuel_price"**
#3. Create a mongodb database **"indiafuellogs"**

    #1 To start a mongodb use command like this (Install Mongo if not present already)
    **`sudo  mongod --dbpath=/data/db --bind_ip=0.0.0.0 -v`**

    #2. Open another terminal and run the below command to see the mongo terminal ( or else use any GUI tools like Robo Mongo)
    **`mongo`**

    #3. To create the db run
    **`use indiafuellogs`**


#4. Run 
    **`npm start`**

for both the applications

#5. Angular app default port is 4201
#6. Node app default port is 3010

#7. Credentials to login

#1. super admin  
username/password
superadmin@unicort.com/123456

#2. district admins

admin1@unicort.com/123456
admin2@unicort.com/123456
admin3@unicort.com/123456

#3. Regular franchisee user

user1@unicort.com/123456
user2@unicort.com/123456


#Features Implemented

#1. Node server application

```
1. Express Server application with MC pattern and Factory pattern
2. Mysql Real Database integration
3. Passoword is hashed. (No gui is provided, but can run sql query. For generating hashed password there is a commented code in the server.js file)
4. Log reporting uses MongoDB.
5. Rate limitting is added to block, more than 2 api(same) calls per second
6. Rate limitting and user block is enabled for the access of fuel api ( 100 > req per day)

```

#2. Angular application

```
1. A descent GUI is added
2. Multiple modules are created
3. Routing is added with AuthGuard authorization
4. HttpIntereptors are added
5. 3 different dashboards are there based on the type of the user logged in
6. Basic form validations are added
7. Please find the screenshots attached
```
