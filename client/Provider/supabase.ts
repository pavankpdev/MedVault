import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string, {
    auth: {
        storage: AsyncStorage,
        detectSessionInUrl: false
    }
});