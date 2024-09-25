# Task-Master

## Overview

Task-Master is a Node.js-based task management application that allows users to sign up, log in, and manage tasks efficiently. This project is styled with Tailwind CSS for a modern and responsive user interface.

## Features

- **User Authentication**: Seamless and easy sign up and log in functionality.
- **Ease of Access**: Users will stay authenticated on the site until their session ends or they log out
- **Security**: User credentials are hashed before being stored in the server
- **Dashboard**: Ability to create and delete categories and tasks
- **Easy Management**: Tasks can be stored in different categories, with titles, descriptions, and timestamps

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/nevolua/Task-Master.git
    cd Task-Master
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the application**:
    ```bash
    node app.js
    ```

## Usage

1. **Signup**: Navigate to the signup page to create a new account.
2. **Login**: Access the login page to sign in.
3. **Dashboard**: After logging in, you will be directed to the dashboard.

## Project Structure

- **app.js**: Main application file.
- **db/**: Contains database-related files.
- **routes/**: Defines application routes.
- **views/**: Contains EJS templates for the front-end.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

Developed by [nevolua](https://github.com/nevolua). For any inquiries, please open an issue on GitHub.
