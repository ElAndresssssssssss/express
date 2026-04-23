//Express helped me to understand how to build an API, here we also applied knowledge about nodejs 

    // To make the deploy we used railway which is a cloud provider in less scale than aws azure etc 
    //we had to connect the git repo with project, made the commits and push
    
    //create an account in railway 
    // create a project with swl to connect the data base 
        //it gives us a connection URL, we copy that one and now that one is going to be our DATABASE_URL in .env 
        //the in the shell we write npx prisma migrate deploy
        //then npx prisma generate 
        //then npx prisma db pull (to verify if we are connected)
        //then we can run the seed.js we have in prisma to verify if they appear in railway 


    // then create a new repo which is going to be the one in github 

    //after

    //then in variables we have to write the enviroment variables that we have in .env 
    //sometimes the git repo can crash when doing the deploy so we have to verify the scripts in json and the start and build command in settings in railway 

    //after having the git repo and the database deploied we can generate a domain in railway, and now that one is going to be our LOCALHOST
        //we had before localhost, now we have that url to work in postman 
        