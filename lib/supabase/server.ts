import { createServerClient as supabaseCreateServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. This is expected during build time.')
    // Return a mock client during build time with proper chaining
    
    // Create a proper mock that can be awaited
    const mockQueryResult = { data: [], error: null }
    const mockSingleResult = { data: null, error: null }
    const mockCountResult = { count: 0, error: null }
    
    // Create a mock query builder that supports chaining
    const createMockQuery = () => {
      const mockQuery: any = {
        select: function(selectParam?: string, options?: any) {
          // Handle count queries
          if (options?.count) {
            // For count queries, we need to return an object that has both the query methods and a then method
            const countQuery = createMockQuery();
            // Add a then method that resolves with the count result
            countQuery.then = (resolve: any) => Promise.resolve(resolve(mockCountResult));
            return countQuery;
          }
          return createMockQuery();
        },
        insert: () => createMockQuery(),
        update: () => createMockQuery(),
        delete: () => createMockQuery(),
        upsert: () => createMockQuery(),
        eq: () => createMockQuery(),
        order: () => createMockQuery(),
        limit: () => createMockQuery(),
        single: function() {
          const singleQuery = createMockQuery();
          // Add a then method that resolves with the single result
          singleQuery.then = (resolve: any) => Promise.resolve(resolve(mockSingleResult));
          return singleQuery;
        },
        range: () => createMockQuery(),
        in: () => createMockQuery(),
        then: (resolve: any) => Promise.resolve(resolve(mockQueryResult))
      };
      return mockQuery;
    };
    
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
        updateUser: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null })
      },
      from: () => createMockQuery(),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
          remove: () => Promise.resolve({ data: null, error: null })
        }),
        listBuckets: () => Promise.resolve({ data: [], error: null })
      }
    }
  }

  return supabaseCreateServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Export the old name for backward compatibility
export { createServerClient as createClient }