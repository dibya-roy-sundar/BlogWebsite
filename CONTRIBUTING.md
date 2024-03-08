# Contributing to Ink Corner

Welcome to Ink Corner! We appreciate your interest in contributing to our project. By contributing, you help make Ink Corner a better place for tech enthusiasts to share their ideas and insights. Before you get started, please take a moment to review the following guidelines.

## Table of Contents

1. [Getting Started](#getting-started)
    - [Fork the Repository](#fork-the-repository)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Configure Environment Variables](#configure-environment-variables)
2. [Contribution Guidelines](#contribution-guidelines)
    - [Branching](#branching)
    - [Commit Messages](#commit-messages)
    - [Code Style](#code-style)
    - [Testing](#testing)
3. [Submitting a Pull Request](#submitting-a-pull-request)
    - [Opening a Pull Request](#opening-a-pull-request)
    - [PR Template](#pr-template)
4. [Code of Conduct](#code-of-conduct)
5. [License](#license)

## Getting Started

### Fork the Repository

To contribute to `Ink Corner`, start by forking the repository to your GitHub account. This will create a copy of the project under your account.

### Clone the Repository

Clone the forked repository to your local machine:

```bash
git clone https://github.com/dibya-roy-sundar/INK-CORNER.git
```
### Install Dependencies
Navigate to the project directory and install the necessary dependencies:
```bash
cd INK-CORNER
npm install
```
### Configure Environment Variables
If you do not have MongoDB installed on your system, create a .env file for sensitive information like database credentials of MongoDB Atlas. Make sure to include the .env file in your .gitignore to keep sensitive information private.

### Contribution Guidelines
### Branching
Create a new branch for each feature or bug fix. Branch names should be descriptive and follow the convention:

```bash
git checkout -b feature/new-feature
```
### Commit Messages
Write clear and concise commit messages. Follow the conventional commit message format:

```bash
git commit -m "feat: add new feature"
```

### Code Style
Adhere to the existing code style. Run linting before submitting a pull request:

```bash
npm run lint
```

### Testing
Ensure that your code is well-tested. Write unit tests for new features and ensure all tests pass:

```bash
npm test
```

### Submitting a Pull Request
### Opening a Pull Request
Once you have made your changes and tested them, open a pull request from your branch to the `main` branch of the original repository.

### PR Template
Use the following template when opening a pull request:

```markdown
## Description

Provide a concise description of the changes in this pull request.

## Checklist

- [ ] I have tested my changes thoroughly.
- [ ] My code follows the project's coding standards.
- [ ] I have updated the documentation if necessary.
- [ ] I have added unit tests for new features.
```
### Code of Conduct
Please review our [Code of Conduct](https://github.com/dibya-roy-sundar/INK-CORNER?tab=coc-ov-file) to understand the standards of behavior.

### License
By contributing to Ink Corner, you agree that your contributions will be licensed under the [LICENSE](https://github.com/dibya-roy-sundar/INK-CORNER?tab=MIT-1-ov-file) of this project.





