name: Pull Request Template
description: Template for creating pull requests
title: "feat/fix/docs: Brief description"
labels: []
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        ## 📋 Pull Request Description

        Please provide a clear and concise description of your changes.

  - type: textarea
    id: description
    attributes:
      label: Description
      description: What does this PR do? What problem does it solve?
      placeholder: This PR adds a new feature that allows users to...
    validations:
      required: true

  - type: textarea
    id: changes
    attributes:
      label: Changes Made
      description: List the specific changes you made.
      placeholder: |
        - Added new component for alumni search
        - Updated API endpoints for better performance
        - Fixed bug in user authentication
    validations:
      required: true

  - type: textarea
    id: testing
    attributes:
      label: Testing Performed
      description: Describe what testing you performed to ensure your changes work correctly.
      placeholder: |
        - Tested on Chrome, Firefox, and Safari
        - Ran all existing tests
        - Added new unit tests
        - Manual testing of the new feature
    validations:
      required: true

  - type: textarea
    id: related
    attributes:
      label: Related Issues
      description: Link to any related issues or discussions.
      placeholder: Closes #123, Related to #456

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: If applicable, add screenshots of your changes.
      placeholder: Before and after screenshots...

  - type: checkboxes
    id: checklist
    attributes:
      label: PR Checklist
      description: Please ensure all items are checked before submitting.
      options:
        - label: I have read the Contributing Guidelines
          required: true
        - label: My code follows the project's style guidelines
          required: true
        - label: I have performed a self-review of my own code
          required: true
        - label: I have added tests that prove my fix is effective or that my feature works
          required: true
        - label: New and existing unit tests pass locally with my changes
          required: true
        - label: I have updated the documentation as needed
          required: true
        - label: I have added comments to complex code sections
          required: false
        - label: This PR has no breaking changes
          required: false

  - type: dropdown
    id: type
    attributes:
      label: PR Type
      description: What type of changes does this PR contain?
      options:
        - Feature (new functionality)
        - Bug Fix (bug correction)
        - Documentation (documentation changes)
        - Style (code style/formatting)
        - Refactor (code restructuring)
        - Test (adding/updating tests)
        - Chore (maintenance tasks)
    validations:
      required: true

  - type: textarea
    id: breaking
    attributes:
      label: Breaking Changes
      description: If this PR contains breaking changes, describe them here.
      placeholder: This change will require users to update their configuration...

  - type: markdown
    attributes:
      value: |
        ## 🎯 Additional Notes

        - Make sure your branch is up to date with the latest changes
        - Follow the commit message conventions
        - Ensure CI/CD pipeline passes
        - Request reviews from appropriate team members

        Thank you for your contribution! 🚀
