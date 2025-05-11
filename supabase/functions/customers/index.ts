
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from "https://esm.sh/zod@3.22.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const customerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  totalSpent: z.number().min(0).optional(),
  lastPurchaseDate: z.string().datetime().optional(),
});

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Create a Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Handle GET request to fetch customers
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const tags = url.searchParams.get('tags')?.split(',');
      const location = url.searchParams.get('location');
      
      let query = supabaseClient
        .from('customers')
        .select('*', { count: 'exact' });
      
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }
      
      if (location) {
        query = query.eq('location', location);
      }
      
      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ data, count, total: count }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Handle POST request to create/update a customer
    else if (req.method === 'POST') {
      const requestData = await req.json();
      
      // Validate the request body
      const validationResult = customerSchema.safeParse(requestData);
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Validation failed', 
            details: validationResult.error.errors 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const customer = validationResult.data;
      
      // Check if customer already exists
      const { data: existingCustomer } = await supabaseClient
        .from('customers')
        .select()
        .eq('email', customer.email)
        .maybeSingle();
      
      let result;
      if (existingCustomer) {
        // Update existing customer
        const { data, error } = await supabaseClient
          .from('customers')
          .update({
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            location: customer.location,
            tags: customer.tags,
            totalSpent: customer.totalSpent,
            lastPurchaseDate: customer.lastPurchaseDate,
            updated_at: new Date().toISOString()
          })
          .eq('email', customer.email)
          .select();
        
        if (error) throw error;
        result = data?.[0];
      } else {
        // Insert new customer
        const { data, error } = await supabaseClient
          .from('customers')
          .insert({
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            location: customer.location,
            tags: customer.tags,
            totalSpent: customer.totalSpent,
            lastPurchaseDate: customer.lastPurchaseDate
          })
          .select();
        
        if (error) throw error;
        result = data?.[0];
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
