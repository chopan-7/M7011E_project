# M7011E_project Group: klint
Authors: 

Chonratid Pangdee, chopan-7@student.ltu.se
Peder Johansson, pedjoh-7@student.ltu.se

## Install
- Clone the repository
- Run following commands to setup a demo enviroment
  - To install the dependencies for the application: `npm install`
  - To create the database: `node dbinit`
  - To populate the database with demo users: `node dataManager`

## Configuration
All global parameters are stored in appSettings.js in the root folder.

## Run the application
- To run the backend server: `npm run server`
- To run the frontend sever: `npm run client`
- To run both servers: `npm run dev`

## API documentation
The API server runs on port 8000 and there are three endpoints for the API.
- Prosumer: /api/prosumer
- Manager: /api/manager
- Simulator: /api/simulator

Each endpoint has a GraphiQL tool for testing query and mutation calls.

### Prosumer API
**Following queries and mutation can be sent to the prosumer API:**
- Queries:
  - prosumerData
  - gettAllProsumer
  - getProsumerInfo
- Mutations:
  - register
  - authenticate
  - setBufferRatio
  - updatePicture
  - signOut

### Manager API
**Following queries and mutation can be sent to the prosumer API:**
- Queries:
  - managerData
  - managerInfo
  - getCurrentPrice
- Mutations:
  - startProduction
  - authenticate
  - signOut
  - setCurrentPrice
  - setBufferRatio
  - addToMarket
  - drainMarket
  - blockUser
  - deleteUser
  - register


### Simulator API
**Following queries and mutation can be sent to the prosumer API:**
- Queries:
  - simulate: Returns the simualtion data.