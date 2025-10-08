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
    
    // Create a comprehensive mock query builder
    const createMockQuery = () => {
      // Return an object with all the methods that Supabase queries support
      return {
        // Query methods
        select: function(selectParam?: string, options?: any) {
          // Handle count queries
          if (options?.count) {
            return Promise.resolve(mockCountResult);
          }
          return createMockQuery();
        },
        insert: () => createMockQuery(),
        update: () => createMockQuery(),
        delete: () => createMockQuery(),
        upsert: () => createMockQuery(),
        
        // Filter methods
        eq: () => createMockQuery(),
        neq: () => createMockQuery(),
        gt: () => createMockQuery(),
        gte: () => createMockQuery(),
        lt: () => createMockQuery(),
        lte: () => createMockQuery(),
        like: () => createMockQuery(),
        ilike: () => createMockQuery(),
        is: () => createMockQuery(),
        in: () => createMockQuery(),
        contains: () => createMockQuery(),
        containedBy: () => createMockQuery(),
        rangeLt: () => createMockQuery(),
        rangeGt: () => createMockQuery(),
        rangeLte: () => createMockQuery(),
        rangeGte: () => createMockQuery(),
        rangeAdjacent: () => createMockQuery(),
        overlaps: () => createMockQuery(),
        textSearch: () => createMockQuery(),
        fts: () => createMockQuery(),
        plfts: () => createMockQuery(),
        phfts: () => createMockQuery(),
        wfts: () => createMockQuery(),
        filter: () => createMockQuery(),
        match: () => createMockQuery(),
        
        // Ordering and limiting
        order: () => createMockQuery(),
        limit: () => createMockQuery(),
        range: () => createMockQuery(),
        single: () => Promise.resolve(mockSingleResult),
        maybeSingle: () => createMockQuery(),
        explain: () => createMockQuery(),
        
        // For count queries
        count: () => Promise.resolve(mockCountResult)
      };
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
      from: () => createMockQuery(),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
          remove: () => Promise.resolve({ data: null, error: null }),
          list: () => Promise.resolve({ data: [], error: null }),
          download: () => Promise.resolve({ data: new Blob(), error: null }),
          move: () => Promise.resolve({ data: null, error: null }),
          copy: () => Promise.resolve({ data: null, error: null })
        }),
        listBuckets: () => Promise.resolve({ data: [], error: null })
      },
      rpc: () => createMockQuery()
    };
    
    return mockClient;
  }

  // If we don't have cookieStore (during build), return a mock
  if (!cookieStore) {
    console.warn('Cookie store not available. Using mock Supabase client.')
    
    // Create a proper mock that supports method chaining
    const mockQueryResult = { data: [], error: null }
    const mockSingleResult = { data: null, error: null }
    const mockCountResult = { count: 0, error: null }
    
    // Create a mock query builder that supports chaining
    const createMockQuery = () => {
      return {
        // Query methods
        select: function(selectParam?: string, options?: any) {
          // Handle count queries
          if (options?.count) {
            return Promise.resolve(mockCountResult);
          }
          return createMockQuery();
        },
        insert: () => createMockQuery(),
        update: () => createMockQuery(),
        delete: () => createMockQuery(),
        upsert: () => createMockQuery(),
        
        // Filter methods
        eq: () => createMockQuery(),
        neq: () => createMockQuery(),
        gt: () => createMockQuery(),
        gte: () => createMockQuery(),
        lt: () => createMockQuery(),
        lte: () => createMockQuery(),
        like: () => createMockQuery(),
        ilike: () => createMockQuery(),
        is: () => createMockQuery(),
        in: () => createMockQuery(),
        contains: () => createMockQuery(),
        containedBy: () => createMockQuery(),
        rangeLt: () => createMockQuery(),
        rangeGt: () => createMockQuery(),
        rangeLte: () => createMockQuery(),
        rangeGte: () => createMockQuery(),
        rangeAdjacent: () => createMockQuery(),
        overlaps: () => createMockQuery(),
        textSearch: () => createMockQuery(),
        fts: () => createMockQuery(),
        plfts: () => createMockQuery(),
        phfts: () => createMockQuery(),
        wfts: () => createMockQuery(),
        filter: () => createMockQuery(),
        match: () => createMockQuery(),
        
        // Ordering and limiting
        order: () => createMockQuery(),
        limit: () => createMockQuery(),
        range: () => createMockQuery(),
        single: () => Promise.resolve(mockSingleResult),
        maybeSingle: () => createMockQuery(),
        explain: () => createMockQuery(),
        
        // For count queries
        count: () => Promise.resolve(mockCountResult)
      };
    };
    
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
      from: () => createMockQuery(),
      rpc: () => createMockQuery()
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