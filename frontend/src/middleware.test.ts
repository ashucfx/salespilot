import { middleware } from './middleware';
import { NextRequest } from 'next/server';

describe('Next.js Middleware Auth Guard', () => {
  const createMockRequest = (pathname: string, tokenValue?: string) => {
    const req = new NextRequest(`http://localhost${pathname}`);
    if (tokenValue) {
      req.cookies.set('token', tokenValue);
    }
    return req;
  };

  it('redirects to /login if no token is present and accessing a protected route', () => {
    const req = createMockRequest('/leads');
    const res = middleware(req);
    
    // Check if it's a redirect response
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/login');
  });

  it('allows access to protected routes if token is present', () => {
    const req = createMockRequest('/leads', 'valid_jwt_token');
    const res = middleware(req);
    
    // Check if it calls NextResponse.next()
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects to /dashboard if token is present and accessing /login', () => {
    const req = createMockRequest('/login', 'valid_jwt_token');
    const res = middleware(req);
    
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/dashboard');
  });

  it('allows access to public paths without token', () => {
    // / is public in our middleware
    const req = createMockRequest('/');
    const res = middleware(req);
    
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('allows access to /forgot-password without token', () => {
    const req = createMockRequest('/forgot-password');
    const res = middleware(req);
    
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });
});
