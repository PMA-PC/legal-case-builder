import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CaseRecord {
    id?: string;
    user_id: string;
    content: any; // Using any for flexibility, but ideally CaseData
    updated_at: string;
}

export const saveCaseData = async (data: any): Promise<{ error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.warn("No user logged in, cannot save to Supabase.");
        return { error: "User not logged in" };
    }

    // Upsert data for the user. Assuming one case per user for now, or using a fixed ID.
    // We'll use the user_id as the unique constraint or a specific ID if we want multiple cases.
    // For this app's current state (single case), we can just upsert based on user_id if we set it as PK, 
    // or better, use a fixed ID for the "current" case or just insert and limit 1.
    // Let's try to upsert a record with a specific ID 'current-case' for this user.

    const { error } = await supabase
        .from('cases')
        .upsert({
            user_id: user.id,
            // We can use a fixed ID for the single active case, or let Supabase generate one.
            // To ensure we update the SAME case, we need a consistent ID or query.
            // Let's assume a 'cases' table where we store the latest state.
            // We'll query for an existing case first or just use a known ID convention if possible.
            // Simpler: Upsert with a match on user_id if the table allows it, but usually ID is PK.
            // Strategy: Select first, if exists update, else insert. OR Upsert if we have an ID.
            // Since we don't have a case ID in the state yet, let's try to fetch one first.
            updated_at: new Date().toISOString(),
            content: data
        }, { onConflict: 'user_id' }) // Assuming user_id is unique for a "single case app" or we have a constraint
        .select();

    return { error };
};

export const loadCaseData = async (): Promise<{ data: any, error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { data: null, error: "User not logged in" };
    }

    const { data, error } = await supabase
        .from('cases')
        .select('content')
        .eq('user_id', user.id)
        .single();

    if (error) {
        return { data: null, error };
    }

    return { data: data?.content, error: null };
};
