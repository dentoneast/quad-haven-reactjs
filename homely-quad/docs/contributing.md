# Contributing Guidelines

Thank you for your interest in contributing to Homely Quad! This document provides guidelines and information for contributors.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our Code of Conduct.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/homely-quad.git
   cd homely-quad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp packages/server/env.example packages/server/.env
   cp packages/web/.env.example packages/web/.env.local
   cp packages/mobile/.env.example packages/mobile/.env
   ```

4. **Build shared package**
   ```bash
   npm run build:shared
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

Examples:
- `feature/user-authentication`
- `fix/property-search-bug`
- `docs/api-documentation`

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test changes
- `chore` - Maintenance tasks

Examples:
```
feat(auth): add user registration
fix(api): resolve property search pagination
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Link related issues
   - Request reviews from maintainers

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless necessary
- Use strict type checking

```typescript
// Good
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Bad
const user: any = { id: 1, email: 'test@example.com' };
```

### React Components

- Use functional components with hooks
- Define proper prop types
- Use meaningful component names
- Keep components small and focused

```typescript
// Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onPress}>
      {title}
    </button>
  );
};
```

### API Endpoints

- Use RESTful conventions
- Implement proper error handling
- Add input validation
- Document endpoints

```typescript
// Good
router.get('/properties', validateSearch, propertyController.getProperties);
router.post('/properties', authenticateToken, validateProperty, propertyController.createProperty);
```

### Error Handling

- Use try-catch blocks
- Provide meaningful error messages
- Log errors appropriately
- Handle edge cases

```typescript
// Good
try {
  const result = await apiCall();
  return result;
} catch (error) {
  logger.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}
```

## Testing

### Unit Tests

Write unit tests for:
- Utility functions
- API endpoints
- React components
- Business logic

```typescript
// Example test
describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
    expect(formatCurrency(2500, 'EUR')).toBe('€2,500.00');
  });
});
```

### Integration Tests

Write integration tests for:
- API endpoints
- Database operations
- Authentication flows
- User workflows

### E2E Tests

Write E2E tests for:
- Critical user journeys
- Cross-platform functionality
- API integration

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex logic
- Provide usage examples
- Update README files

```typescript
/**
 * Formats a currency value with the specified currency code
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string, locale: string = 'en-US'): string {
  // Implementation
}
```

### API Documentation

- Document all endpoints
- Provide request/response examples
- Include error codes
- Update OpenAPI/Swagger specs

### README Updates

- Update installation instructions
- Add new features to feature list
- Update environment variables
- Include troubleshooting steps

## Performance

### Web App

- Optimize images
- Use lazy loading
- Implement proper caching
- Minimize bundle size

### Mobile App

- Optimize bundle size
- Use proper image sizes
- Implement efficient navigation
- Optimize re-renders

### Backend

- Optimize database queries
- Implement caching
- Use connection pooling
- Monitor performance

## Security

### General Security

- Validate all inputs
- Use HTTPS
- Implement proper authentication
- Follow OWASP guidelines

### API Security

- Use rate limiting
- Implement CORS properly
- Validate JWT tokens
- Sanitize inputs

### Data Protection

- Encrypt sensitive data
- Use secure storage
- Implement proper access controls
- Regular security audits

## Accessibility

### Web Accessibility

- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Mobile Accessibility

- Add accessibility labels
- Support screen readers
- Ensure touch targets are adequate
- Test with accessibility tools

## Review Process

### Pull Request Review

- Code quality and standards
- Functionality and logic
- Test coverage
- Documentation updates
- Performance implications
- Security considerations

### Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact is considered
- [ ] Security implications are addressed

## Release Process

### Versioning

We use semantic versioning (SemVer):
- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes (backward compatible)

### Release Steps

1. Update version numbers
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Build all packages
6. Create release tag
7. Deploy to staging
8. Deploy to production

## Getting Help

### Resources

- [Project Documentation](./README.md)
- [API Documentation](./docs/api.md)
- [Mobile Guide](./docs/mobile.md)
- [Web Guide](./docs/web.md)
- [Deployment Guide](./docs/deployment.md)

### Communication

- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - General questions and discussions
- Pull Request Comments - Code-specific discussions

### Questions

If you have questions:
1. Check existing documentation
2. Search existing issues and discussions
3. Create a new issue with the "question" label
4. Ask in GitHub Discussions

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation
- GitHub contributor list

## License

By contributing to Homely Quad, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Homely Quad! 🚀
