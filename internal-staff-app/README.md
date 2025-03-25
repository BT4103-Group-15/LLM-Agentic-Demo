# How to Run an HTML File

Follow these steps to run your HTML file locally:

---

## 1. Navigate to the Directory

- Make sure you’re in the directory where your HTML file is located.

---

## 2. Start the Server

- Run the following command in your terminal (assuming you're using Python 3):

  ```
  python3 -m http.server
  ```

---

## 3. Open Your Browser

- Open a web browser (e.g., Google Chrome, Firefox, Safari).
- In the address bar, enter the following URL:

  ```
  http://localhost:8000/index.html
  ```

## Running the MySQL Database locally 

## 1. Connecting to MySQL Database
- Ensure that you have MySQL Workbench installed, then refer to `.env.example` file to  create 
a `.env` file with your credentials. 

## 2. Installing packages
- Ensure that you have npm installed on your machine.  
- Then, in the project folder, `cd internal-staff-app`, then run `npm install` in your command line. 

## 3. Database actions
- `npm run db:drop` to drop database
- `npm run db:migrate` to seed database with all migration scripts from the migrations folder.
- `npm run start` to start the database connection [Note: This command is necessary if you would like to utilise the API endpoints.]
- Note: Ensure that you are in the `internal-staff-app` folder before running the above commands.

## 4. Testing APIs
- Download Bruno 
- Click on Collection > Open Collection, then select folder bruno_api_endpoints from internal-staff-app project folder 