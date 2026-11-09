import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const configured = !!(url && key)
export const sb = createClient(url || 'http://localhost', key || 'missing')
export const CATS = ['Websites', 'Web Applications', 'Mobile Applications', 'Software Solutions']
export const SERVICES = ['Website design and development', 'Web application development', 'Mobile application development', 'Custom software development', 'UI/UX design', 'Database development and management', 'IT consulting and technical support', 'Software maintenance']
