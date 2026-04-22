//EXPRESS JS is a web application framework for Node.js, designed for building web applications and APIs. It provides a robust set of features for web and mobile applications, making it easier to manage routes, handle requests and responses, and integrate with various middleware.

require('dotenv').config(); //dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. It is used to manage configuration settings and sensitive information in a secure way.
const express = require('express'); //this is the way to import native moduels in node js 



const LoggerMiddleware = require('./src/middleware/logger')
const errorHandler = require('./src/middleware/errorHandler')
const authenticateToken = require('./src/middleware/auth')


const bodyParser = require('body-parser'); //body-parser is a middleware that parses incoming request bodies in a middleware before your handlers, available under the req.body property. It is commonly used to handle form data and JSON payloads in Express applications.
//A middleware is a function that runs between the request and the response 
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs') //we had to download it 
const jwt = require('jsonwebtoken') //we had to download it 

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json'); //__dirname is a global variable in Node.js that represents the directory name of the current module. It is used to construct the absolute path to the users.json file, ensuring that the file can be accessed correctly regardless of where the script is executed from. 

const app = express(); //here we are creating an instance of the Express application, which will be used to define routes and middleware for our server.
app.use(bodyParser.json()); // It is commonly used to handle form data and JSON payloads in Express applications.
app.use(bodyParser.urlencoded({ extended: true })); // It is commonly used to handle form data and JSON payloads(datos que recibes de una peticion) in Express applications. The extended option allows for rich objects and arrays to be encoded into the URL-encoded format, which can be useful for handling complex data structures in form submissions.
app.use(LoggerMiddleware)
const PORT = process.env.PORT || 3000; //process.env.PORT is used to get the port number from environment variables, if not set it defaults to 3000
app.use(errorHandler)



app.get('/', (req, res) => {
    res.send(
        `<h1>Welcome to my Express server!!</h1>
        <p>This is a simple Express application running on port ${PORT}.</p>`
    );
});


app.get('/users/:id', (req, res) => { //:id is a dynamic route where part of the URL is a variable, not fixed (a dynamic route lets us handle many URLs with one route by using variables in the path)
    const userId = req.params.id; //req.params is an object containing properties mapped to the named route “parameters”. For example, if you have a route defined as /users/:id, and a request is made to /users/123, then req.params.id will be '123'.
    res.send(`Information for User ID: ${userId}`);
});

app.get('/search', (req, res) => { //its like "if someone makes a GET request to /search, run this function "
    const terms = req.query.terms || 'No search terms provided'; //req.query is an object containing a property for each query string parameter in the route. For example, if you have a route defined as /search?terms=example, and a request is made to /search?terms=example, then req.query.terms will be 'example'.
    const category = req.query.category || 'No category provided'; //req.query is an object containing a property for each query string parameter in the route. For example, if you have a route defined as /search?category=books, and a request is made to /search?category=books, then req.query.category will be 'books'. EVERYTHING AFTER ? IS A QUERY STRING
    res.send(
        `<h2>Search Results</h2>
        <p>Search Terms: ${terms}</p>
        <p>Category: ${category}</p>`
    );
});
//with the code above we can eg open the URL http://localhost:3000/search?terms=example&category=books and it will display the search terms and category in the response.
//REQUEST: the entire message sent from the client to the server
//QUERY: a small part of the request (inside the URL)


app.post('/form', (req, res) => {
    const name = req.body.name || 'No name provided'; //req.body is an object containing the parsed body of the request. For example, if you have a route defined as /form and a POST request is made with a JSON body { "name": "John" }, then req.body.name will be 'John'.
    const email = req.body.email || 'No email provided'; //req.body is an object containing the parsed body of the request. For example, if you have a route defined as /form and a POST request is made with a JSON body { "email": " 
    res.json({
        message: 'Form submitted successfully!',
        name: name,
        email: email
    });
})

app.post('/api/data', (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
    }

    res.status(200).json({
        message: 'Data received successfully!',
        receivedData: data
    });
})


app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users data' }); //.json means that we are sending a JSON response
        }
        const users = JSON.parse(data); //here we are parsing the data from user.json to convert it from a JSON string into a Javascript object
        res.json(users); // here we are sending the users data as a JSON response to the client
    })
});


app.post('/users', (req, res) => { //this can be tested with Postman
    const newUser = req.body; //body is the data sent by the client in the request 
    const name = newUser.name || 'No name provided';
    const email = newUser.email || 'No email provided';
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex for validating email format
    const userId = parseInt(newUser.id);

    if (name.length < 3) {
        return res.status(400).json({error:'Name must be at least 3 characters long'})
    }

    if (!regexEmail.test(email)) { //here it compairs the email with the regex format, regex stands for regular expression
        return res.status(400).json({ error: 'Invalid email format' });
    }
    fs.readFile(usersFilePath, 'utf8', (err, data) => { //data is the content of the users.json
        if (err) {
            return res.status(500).json({ error: 'Failed to read users data' });
        }
        const users = JSON.parse(data);
        const idExists = users.some(user => user.id === userId);

        if (!userId || idExists) {
            return res.status(400).json({ error: 'This id already exists' });
        }
        users.push(newUser); //aggregate a new user to the existing users.json file 
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save user data' });
            }
            res.status(201).json({ message: 'User added successfully!' });
        })
    })
})

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10)
    const updateUser = req.body;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!updateUser.name || !updateUser.email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    if (!regexEmail.test(updateUser.email)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }

    if (updateUser.name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long' })
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users data' });
        }

        let users = JSON.parse(data);
        
        users = users.map(user => user.id === userId ? { ...user, ...updateUser } : user); //here we are updating the user with the new data sent in the request body, if the user id matches the id in the users.json file { ...user, ...updateUser } means that we are merging the existing user data with the new data, so if there are any fields in the updateUser that are not in the existing user, they will be added, and if there are any fields that are in both, the values from updateUser will overwrite the existing values.
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save user data' });
            }
            res.status(200).json({ message: 'User updated successfully!' });
        })
    })
})

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10); 
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users data' });
        }
        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userId); //here we are filtering out the user with the id that matches the id in the request params, so if the user id matches the id in the users.json file, it will be removed from the users array
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save user data' });
            }
            res.status(204).send(); //204 means that the request was successful but there is no content to send back, so we just send an empty response with a 204 status code
        })
    })

})

app.get('/error', (req, res, next) => {
    next(new Error('error intencional'))
})


app.get('/db-users', async (req, res) => { //async and await because database calls take time
    try {
        const users = await prisma.user.findMany(); //prisma -> the prisma client, user -> the table/model in prisma schema, findMany() -> get all users from database
        res.json(users)
    } catch (error) {
        res.status(500).json({error: 'error with the communication of the database'})
    }
})

app.get('/protected-route', authenticateToken, (req, res) => { //this one is connected with auth.js (test it in postman and click on headers, in key wirte Authorization, in value Bearer fdsafdsbayufa)
    res.send('This is a protected route')
})

app.post('/register', async (req, res) => {
    const {email, password, name} = req.body; //get email, password, name 
    const hashedPassword = await bcrypt.hash(password, 10) //encrypting a password

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword, 
            name, 
            role: 'USER'

        }
    });
    res.status(201).json({message: 'User Registered succesfully'})
}); 

app.post('/login', async (req, res) => {
    const {email, password} = req.body; //get email and password
    const user = await prisma.user.findUnique({where: {email}}); //is not going to work with non-ecrypted passwords

    if (!user) return res.status(400).json({error: 'Invalid email or password'}) 
    
    const validPassword = await bcrypt.compare(password, user.password); //validate if the password is ok 

    if(!validPassword) return res.status(400).json({error: 'Invalid email or password'})
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '4h'})

    res.json({token}); //at the end this will give us the token that WE CAN PUT IN '/protected-route'
    
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*
Think of your server like a receptionist:
________________________________________
app.get → “If someone asks for this…”
'/' → “…this specific place…”
(req, res) → “…handle the request and respond…”
res.send() → “…give them an answer”
*/

//a .env file is a simple text file that contains environment variables in the format KEY=VALUE. It is used to store configuration settings and sensitive information, such as API keys, database credentials, and other environment-specific variables. The .env file is typically placed in the root directory of a project and is not committed to version control to keep sensitive information secure. In Node.js applications, the dotenv package can be used to load the variables from the .env file into process.env, allowing you to access them in your code.

//IF WE MAKE CHANGES TO THE CODE ITS BETTER TO START THE CODE WITH node --watch filename to automatically restart the server whenever changes are made to the code. This is especially useful during development, as it saves time and ensures that the latest changes are always reflected without needing to manually stop and restart the server.

//nvm stands for Node version manager that allows to switch between different versions of Node.js 

//we downloaded postman (a popular API testing tool) to test our endpoints and see the responses without needing to use a browser or write additional code. It provides a user-friendly interface for making HTTP requests, setting headers, and viewing responses, making it easier to debug and develop APIs.
