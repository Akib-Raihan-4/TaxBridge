import type { Access, FieldAccess } from 'payload'

/** Public content: anyone may read. */
export const anyone: Access = () => true

/** Any logged-in user (admin or editor). */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Admins only. */
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

/** Logged-in users see everything; the public sees published documents only. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Logged-in users see everything; the public sees approved documents only. */
export const approvedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { approved: { equals: true } }
}

/** Admins can act on any user; everyone else only on their own account. */
export const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}
