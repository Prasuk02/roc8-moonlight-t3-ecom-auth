import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import axios from 'axios';
import { env } from './env';
 
export async function middleware (request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRouteLinks = ['/', '/login', '/signup', '/signup/verify'];

  const isPublicPath = publicRouteLinks.includes(pathname);
  const token = request.cookies.get('token')?.value || ''
  const isTokenAuthenticated = await verifyJwtToken(token);

  // Redirect to login page if the token is not authenticated and the path is not public.
  if (!isTokenAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Allow access to public routes and if the token is not authenticated.
  if (!isTokenAuthenticated && isPublicPath) {
    return NextResponse.next();
  }
  
  // Redirect authenticated users from public routes to the categories page.
  if (isTokenAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/categories', request.url));
  }

  // Allow access to non-public routes if the token is authenticated.
  if (isTokenAuthenticated && !isPublicPath) {
    return NextResponse.next();
  }

}

/**
 * @description Endpoint to verify JWT token stored
 * @param {string} token 
 * @returns {Promise<boolean>}
 */
const verifyJwtToken = async (token: string) => {
  try { 
    const { data: { success } } = await axios.post(`${env.API_BASE_URL}/api/auth/verifyToken`, { token });
    return success;
  } catch (error) {
    return false;
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/signup/verify',
    '/categories'
  ],
}