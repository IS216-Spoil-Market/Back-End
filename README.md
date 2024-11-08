# Swaply Backend

### By cloning

- Clone this template with `git clone https://github.com/IS216-Spoil-Market/Back-End/.git`
- Set direction to your current remote with `git remote add origin <your_git_remote>`
- Push it to your master branch in your remote repository `git push -u origin master`

### By zip file

- Download contents as zip file
- Initialize a git repository in the root directory with `git init`
- Set direction to your current remote with `git remote add origin <your_git_remote>`
- Push it to your master branch in your remote repository `git push -u origin master`

## Further Configuration

### Installing dependencies

- Run `bun install` to install all the dependencies (This step requires you to have bun installed globally with `npm install -g bun`)
- If you wished to run the dev build, run `bun run dev`. If you wished to build for production, run `bun run build` 

Note: Replace `bun` with `npm` if you are using `npm`

### ENV

Create an `.env` file which should contain
- `AUTH0_DOMAIN`: Value should be Auth0's domain (eg: https://dev-xxxxxxxxxxx.us.auth0.com)
- `MONGODB_CONN_URL`: Value should be URL of the MongoDB Cluster with its DB name (eg: mongodb+srv://<user>:<password>@<cluster_name>.<cluster>.mongodb.net/<db_name>)
- `AUDIENCE`: Value should be URL of the location of where this application is run (eg: http://localhost:5001)

### URL

- Hosted Application: https://back-end-04u0.onrender.com
- GitHub Remote Repository (SSH): git@github.com:IS216-Spoil-Market/Back-End.git
- GitHub Remote Repository (HTTPS): https://github.com/IS216-Spoil-Market/Back-End.git

- ### Additional Comments

- Application instances takes time to spin up after inactivity. Please allow up to 15 minutes for both instances to warm-up for every 1st access of pages with data you have made on the day for the hosted variant (especially the pages that requires data from the backend)
