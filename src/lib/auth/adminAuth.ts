/**
 * Centralized Admin Authentication Utilities
 *
 * Single source of truth for admin session validation across all admin routes.
 * Replaces 6+ scattered implementations with consistent error handling.
 */

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export function getAdminSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'HelYlana1000Dias!'
  )
}

/**
 * Check if the current request has valid admin authentication
 * For use in Server Components (App Router pages)
 *
 * @returns boolean - true if authenticated, false otherwise
 *
 * @example
 * ```tsx
 * export default async function AdminPage() {
 *   if (!(await isAdminAuthenticated())) {
 *     redirect('/admin/login')
 *   }
 *   // ... render admin content
 * }
 * ```
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')?.value

  return adminSession === getAdminSessionSecret()
}

/**
 * Check admin authentication from NextRequest object
 * For use in API routes and middleware
 *
 * @param request - NextRequest object from API route
 * @returns boolean - true if authenticated, false otherwise
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   if (!isAdminAuthenticatedFromRequest(request)) {
 *     return unauthorizedResponse()
 *   }
 *   // ... handle request
 * }
 * ```
 */
export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session')?.value
  return adminSession === getAdminSessionSecret()
}

/**
 * Standard unauthorized response for API routes
 *
 * @param message - Optional custom error message (default: "Não autorizado")
 * @returns NextResponse with 401 status
 *
 * @example
 * ```ts
 * if (!isAdminAuthenticatedFromRequest(request)) {
 *   return unauthorizedResponse()
 * }
 * ```
 */
export function unauthorizedResponse(message = 'Não autorizado'): NextResponse<{ error: string }> {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

/**
 * Standard bad request response for API routes
 *
 * @param message - Error message describing the validation failure
 * @returns NextResponse with 400 status
 *
 * @example
 * ```ts
 * if (!body.action) {
 *   return badRequestResponse('Ação é obrigatória')
 * }
 * ```
 */
export function badRequestResponse(message: string): NextResponse<{ error: string }> {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  )
}

/**
 * Standard not found response for API routes
 *
 * @param message - Error message (default: "Não encontrado")
 * @returns NextResponse with 404 status
 */
export function notFoundResponse(message = 'Não encontrado'): NextResponse<{ error: string }> {
  return NextResponse.json(
    { error: message },
    { status: 404 }
  )
}

/**
 * Standard server error response for API routes
 *
 * @param message - Error message (default: "Erro interno do servidor")
 * @returns NextResponse with 500 status
 */
export function serverErrorResponse(message = 'Erro interno do servidor'): NextResponse<{ error: string }> {
  return NextResponse.json(
    { error: message },
    { status: 500 }
  )
}

/**
 * Standard success response for API routes
 *
 * @param data - Response data
 * @param message - Optional success message
 * @returns NextResponse with 200 status
 *
 * @example
 * ```ts
 * return successResponse({ post: updatedPost }, 'Post aprovado com sucesso')
 * ```
 */
export function successResponse<T>(data: T, message?: string): NextResponse<T & { success: true; message?: string }> {
  const response: any = { success: true, ...data }
  if (message) {
    response.message = message
  }
  return NextResponse.json(response)
}
