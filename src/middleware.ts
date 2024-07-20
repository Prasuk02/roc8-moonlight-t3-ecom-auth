import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import axios from 'axios';
 
// This function can be marked `async` if using `await` inside
export async function middleware (request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRouteLinks = ['/', '/login', '/signup', '/signup/verify'];

  const isPublicPath = publicRouteLinks.includes(pathname);
  const token = request.cookies.get('token')?.value || ''
  const { success: isTokenAuthenticated } = await verifyJwtToken(token);

  if (!isTokenAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (!isTokenAuthenticated && isPublicPath) {
    return NextResponse.next();
  }
  
  if (isTokenAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/categories', request.url));
  }

  if (isTokenAuthenticated && !isPublicPath) {
    return NextResponse.next();
  }

}

const verifyJwtToken = async (token: string) => {
  try { 
    const { data } = await axios.post('http://localhost:3000/api/auth/verifyToken', { token });
    return data;
  } catch (error) {
    return {
      success: false
    }
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/signup/verify',
    '/categories'
  ],
}