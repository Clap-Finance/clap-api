import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.client = createClient(url, anonKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
