
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

/**
 * 💡 SUPABASE PROJECT CONFIGURATION
 * Project: qffedgmjvloxfzcqgkie
 */
const supabaseUrl = 'https://qffedgmjvloxfzcqgkie.supabase.co';

/**
 * Note: If you encounter authentication errors, ensure this is the 
 * 'anon' public key from Settings -> API, and NOT your database password.
 * Standard Supabase anon keys usually start with 'eyJ...'
 */
const supabaseAnonKey = 'C+-T6pkuqF4xWR5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
