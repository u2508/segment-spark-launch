
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from "https://esm.sh/zod@3.22.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive()
});

const orderSchema = z.object({
  customerEmail: z.string().email(),
  orderDate: z.string().datetime(),
  products: z.array(productSchema).min(1),
  totalAmount: z.number().positive(),
  status: z.enum(['completed', 'pending', 'cancelled']).default('completed')
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
    // Handle GET request to fetch orders
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const customerEmail = url.searchParams.get('customerEmail');
      const status = url.searchParams.get('status');
      const fromDate = url.searchParams.get('fromDate');
      const toDate = url.searchParams.get('toDate');
      
      let query = supabaseClient
        .from('orders')
        .select('*', { count: 'exact' });
      
      if (customerEmail) {
        query = query.eq('customerEmail', customerEmail);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (fromDate) {
        query = query.gte('orderDate', fromDate);
      }
      
      if (toDate) {
        query = query.lte('orderDate', toDate);
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
    // Handle POST request to create a new order
    else if (req.method === 'POST') {
      const requestData = await req.json();
      
      // Validate the request body
      const validationResult = orderSchema.safeParse(requestData);
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
      
      const order = validationResult.data;
      
      // Check if customer exists
      const { data: existingCustomer } = await supabaseClient
        .from('customers')
        .select('id')
        .eq('email', order.customerEmail)
        .maybeSingle();
      
      if (!existingCustomer) {
        return new Response(
          JSON.stringify({ 
            error: 'Customer not found', 
            details: 'The specified customer email does not exist in the database.' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Create new order
      const { data, error } = await supabaseClient
        .from('orders')
        .insert({
          customerEmail: order.customerEmail,
          orderDate: order.orderDate,
          products: order.products,
          totalAmount: order.totalAmount,
          status: order.status
        })
        .select();
      
      if (error) throw error;
      
      // Update customer's total spent and last purchase date
      await supabaseClient
        .from('customers')
        .update({
          totalSpent: supabaseClient.rpc('increment_total_spent', { 
            p_email: order.customerEmail, 
            p_amount: order.totalAmount 
          }),
          lastPurchaseDate: order.orderDate,
          updated_at: new Date().toISOString()
        })
        .eq('email', order.customerEmail);
      
      return new Response(
        JSON.stringify(data?.[0]),
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
