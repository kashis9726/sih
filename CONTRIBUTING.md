# 🤝 Contributing to AluVerse

Thank you for considering contributing to AluVerse! We welcome all contributions that help improve our alumni management platform.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

## 📋 Development Workflow

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/aliverse.git
cd aliverse

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/aliverse.git
```

### 2. Create Feature Branch
```bash
# Always create a new branch for your work
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/bug-description
# or for documentation
git checkout -b docs/update-readme
```

### 3. Make Changes
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Guidelines
```bash
# Stage your changes
git add .

# Write a clear, descriptive commit message
git commit -m "feat: add new alumni search functionality"

# Push to your fork
git push origin feature/your-feature-name
```

#### Commit Message Format
```
type: description

[optional body]

[optional footer]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Pull Request Process
1. **Create** a pull request from your feature branch
2. **Fill out** the PR template completely
3. **Reference** any related issues
4. **Wait** for code review
5. **Address** any feedback
6. **Merge** when approved

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Add tests for new features
- Ensure existing tests still pass
- Aim for good test coverage
- Use descriptive test names

## 📝 Code Style

### Linting
```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Formatting
- Use 2 spaces for indentation
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic

## 📚 Documentation

### Update Documentation
- Update README.md for user-facing changes
- Update inline code comments
- Add API documentation for new endpoints
- Update CHANGELOG.md for releases

## 🔧 Development Environment

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚨 Reporting Issues

### Bug Reports
1. **Check** existing issues first
2. **Create** a new issue with the bug template
3. **Include**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots (if applicable)

### Feature Requests
1. **Check** existing issues and discussions
2. **Create** a new issue with the feature request template
3. **Describe** the feature and its benefits
4. **Provide** use cases and examples

## 🔒 Security

### Reporting Security Issues
- **Do NOT** create public issues for security vulnerabilities
- Email: security@aliverse.com
- Include detailed reproduction steps
- We follow responsible disclosure practices

## 🎯 Branch Naming Convention

```
feature/short-description
fix/short-description
docs/short-description
refactor/short-description
test/short-description
chore/short-description
```

## 📊 Pull Request Template

When creating a PR, please include:

- **Description** of changes
- **Related issues** (if any)
- **Testing** performed
- **Screenshots** (if UI changes)
- **Breaking changes** (if any)

## ✅ Code Review Process

### What We Look For
- Code functionality
- Code style consistency
- Test coverage
- Documentation updates
- Performance impact
- Security considerations

### Review Checklist
- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Performance impact assessed

## 🚀 Release Process

1. **Feature Freeze** - Stop adding new features
2. **Testing** - Run full test suite
3. **Documentation** - Update changelog and docs
4. **Release** - Tag and publish
5. **Announcement** - Update release notes

## 📞 Getting Help

- **Discussions**: [GitHub Discussions](https://github.com/ORIGINAL_OWNER/aliverse/discussions)
- **Issues**: [GitHub Issues](https://github.com/ORIGINAL_OWNER/aliverse/issues)
- **Email**: support@aliverse.com

---

**Thank you for contributing to AluVerse! 🎉**

*This document is adapted from [Contributing Guidelines Template](https://github.com/nayafia/contributing-template)*
