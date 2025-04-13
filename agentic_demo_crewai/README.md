The things accomplished by this repository

1. Generate SOW from the conversation with the client.
2. Generate the Summary of scope that the client provided in a pre-defined template
3. Answer client questions with regards to (Pricing, Manhours, Speciality? Feasibility)
4. Summarise the Client questions and forward them to the tech Pre-Sale team member
5. Generate SOW and allow the Tech-Presales team to edit them while generating the requirements -> INTERRUPT function (note) 
6. SLM would generate a PDF report on the requirement validation and risk assessment and send it via email to the client, sales team and tech pre-sale team.


## How to run the MySQL Database locally 

## 1. Connecting to MySQL Database
- Ensure that you have MySQL Workbench installed, then refer to `.env.example` file to  create 
a `.env` file with your credentials. 

## 2. Installing packages
- Ensure that you have npm installed on your machine.  
- Then, in the project folder, run `npm install` in your command line. 

## 3. Database actions
- `npm run db:test` - Tests the database connection to verify configuration [Only tests if database connection works]
- `npm run db:reset` - Drops and recreates the database, giving you a clean slate
- `npm run db:migrate` - Initializes the database with tables defined in migration files
- `npm run db:seed_dummy_data` - Populates the database with sample data for testing
- `npm run start`  - Starts the application with database connection [Required for API endpoints]

## 4. Testing APIs
- Download Bruno 
- Click on Collection > Open Collection, then select folder bruno_api_endpoints