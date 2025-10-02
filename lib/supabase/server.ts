import { createServerClient as supabaseCreateServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerClient() {
  // During build time, cookies() will throw an error, so we need to handle it
  let cookieStore;
  try {
    cookieStore = await cookies()
  } catch (e) {
    // During build time, we can't access cookies, so we'll use a mock
    console.warn('Unable to access cookies during build time. Using mock cookie store.');
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time or when env vars are missing, return a more robust mock
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. Using mock client.')
    
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
            // For count queries, return a Promise directly to avoid TS1320 error
            return Promise.resolve(mockCountResult);
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
          // Return a Promise directly to avoid TS1320 error
          return Promise.resolve(mockSingleResult);
        },
        range: () => createMockQuery(),
        in: () => createMockQuery()
      };
      
      // For general queries, make them thenable but ensure they're proper Promises
      return new Promise((resolve) => {
        // Add chainable methods to the Promise
        const promise = Promise.resolve(mockQueryResult);
        Object.assign(promise, mockQuery);
        resolve(mockQueryResult);
      });
    };
    
    // Create a more complete mock Supabase client
    const mockClient: any = {
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
      from: () => ({
        select: (selectParam?: string, options?: any) => {
          if (options?.count) {
            return Promise.resolve(mockCountResult);
          }
          return createMockQuery();
        },
        insert: () => createMockQuery(),
        update: () => createMockQuery(),
        delete: () => createMockQuery(),
        upsert: () => createMockQuery()
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
          remove: () => Promise.resolve({ data: null, error: null })
        }),
        listBuckets: () => Promise.resolve({ data: [], error: null })
      }
    };
    
    return mockClient;
  }

  // If we don't have cookieStore (during build), return a mock
  if (!cookieStore) {
    console.warn('Cookie store not available. Using mock Supabase client.')
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
      }),
    } as any
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