# Contributing to DOI to Sci-Hub Extension

Thank you for your interest in contributing to this Chrome extension! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and considerate in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported.

**Bug Report Guidelines:**
- Use the bug report template
- Describe the bug clearly and concisely
- Include steps to reproduce the issue
- Provide expected vs actual behavior
- Include browser version and OS information
- Add screenshots if relevant

### Suggesting Enhancements

We welcome feature requests! Please:

- Use the feature request template
- Describe the enhancement in detail
- Explain why this feature would be useful
- Consider the impact on existing functionality

### Code Contributions

We welcome code contributions! Here's how to get started:

## Development Setup

### Prerequisites

- Google Chrome browser
- Git
- Basic knowledge of HTML, CSS, and JavaScript
- Text editor (VS Code, Sublime Text, etc.)

### Local Development

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/doi-to-scihub-extension.git
   cd doi-to-scihub-extension
   ```

2. **Load the extension in Chrome**
   - Open `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked" and select the project folder

3. **Make your changes**
   - Edit the source files
   - Test in Chrome
   - Reload the extension to see changes

## Coding Standards

### JavaScript

- Use **2 spaces** for indentation
- Use **semicolons** at the end of statements
- Use **const** and **let** instead of **var**
- Use **arrow functions** where appropriate
- Add **comments** for complex logic
- Use **descriptive variable names**

### HTML

- Use **semantic HTML** elements
- Include **alt attributes** for images
- Use **proper indentation**
- Keep **accessibility** in mind

### CSS

- Use **consistent naming conventions**
- Group **related styles** together
- Use **comments** for complex selectors
- Consider **responsive design**

### Chrome Extension Specific

- Follow **Manifest V3** guidelines
- Use **proper permissions** (minimal required)
- Handle **message passing** correctly
- Test on **multiple websites**

## Testing

### Manual Testing

Before submitting changes, please test:

1. **Basic functionality**
   - Extension loads without errors
   - Popup opens correctly
   - DOI detection works on various sites
   - Sci-Hub links are created properly

2. **Edge cases**
   - Pages with no DOI links
   - Pages with multiple DOI links
   - Clicking button multiple time must not duplicate icons
   - Different website layouts

3. **Browser compatibility**
   - Chrome (latest version)

### Testing Checklist

- [ ] Extension loads without console errors
- [ ] Popup UI displays correctly
- [ ] DOI detection works on academic sites
- [ ] Sci-Hub links are created and functional
- [ ] No duplicate links are created
- [ ] Extension works on different page types
- [ ] Icons display correctly
- [ ] No performance issues

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Test thoroughly
   - Follow coding standards

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: brief description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Include testing information
   - Link any related issues

### Commit Message Guidelines

Use clear, descriptive commit messages:

- **Good**: `Add support for DOI links with special characters`
- **Bad**: `fix stuff`

### Pull Request Guidelines

- **Title**: Clear, descriptive title
- **Description**: Explain what and why (not how)
- **Testing**: Describe how you tested the changes
- **Screenshots**: Include if UI changes were made

## Review Process

1. **Automated checks** will run on your PR
2. **Maintainers** will review your code
3. **Feedback** will be provided if needed
4. **Changes** may be requested
5. **Approval** and merge when ready

## Getting Help

If you need help:

- **Check existing issues** for similar problems
- **Search documentation** and README
- **Ask questions** in issues or discussions
- **Join community** discussions

## Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes**
- **GitHub contributors** page

Thank you for contributing! 