# Blockchain Explorer

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Redis Setup](#redis-setup)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

This project is a simple blockchain explorer built using React for the frontend and Node.js for the backend.

## Features

- View the entire blockchain.
- Create transactions and view them in a transaction pool.
- Mine transactions from the transaction pool.
- Wallet functionalities including balance check.
- Connect to MetaMask for Ethereum transactions.

## Installation

Clone the repository and navigate into the directory:

```bash
git https://github.com/musta7188/BLOCKCHAIN_/blob/main/Readme.md
cd BLOCKCHAIN

Install the required packages:

Prerequisites
Node.js and npm
Redis
Setting Up Redis
Before running the application, you'll need to have Redis installed and running on your machine.

For macOS:

brew install redis
brew services start redis

For Ubuntu:

sudo apt update
sudo apt install redis-server

To confirm Redis is running:

redis-cli ping

If it returns PONG, then Redis is running successfully.

Installation
Clone the repository:


git clone https://github.com/your-repo/blockchain-explorer.git
Navigate to the project directory:

cd blockchain-explorer
Install backend dependencies:


npm install
Navigate to the client directory:


cd client
Install frontend dependencies:


npm install
Running the Application
Backend
Navigate to the project root directory and run:


npm start
Frontend
Navigate to the client directory and run:


npm start
Open your browser and go to http://localhost:3000.

Testing
To run tests, navigate to the project root directory and run:


npm test

