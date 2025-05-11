
import React from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ApiDocPage: React.FC = () => {
  return (
    <div className="flex-1 h-screen overflow-auto">
      <Header title="API Documentation" />
      
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Integration guides and endpoint references for the campaign management system.
          </p>
        </div>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Base URL</AlertTitle>
          <AlertDescription>
            All API endpoints are relative to: <code className="bg-muted p-1 rounded">/api</code>
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="customers">Customers API</TabsTrigger>
            <TabsTrigger value="orders">Orders API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>POST /api/customers</CardTitle>
                <CardDescription>Add a new customer or update existing customer data</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Request Body Schema</h3>
                <pre className="bg-muted p-4 rounded overflow-auto">
{`{
  "email": "string", // required, unique identifier
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "location": "string",
  "tags": ["string"],
  "totalSpent": number,
  "lastPurchaseDate": "string" // ISO date format
}`}
                </pre>
                
                <h3 className="font-semibold mt-4 mb-2">Response</h3>
                <p className="text-muted-foreground mb-2">Success (200 OK)</p>
                <pre className="bg-muted p-4 rounded overflow-auto">
{`{
  "id": "uuid",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "created_at": "string",
  "updated_at": "string"
}`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>GET /api/customers</CardTitle>
                <CardDescription>Retrieve a list of customers with optional filtering</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Query Parameters</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li><code className="bg-muted p-1 rounded">limit</code> - Maximum number of results (default: 50)</li>
                  <li><code className="bg-muted p-1 rounded">offset</code> - Pagination offset (default: 0)</li>
                  <li><code className="bg-muted p-1 rounded">tags</code> - Filter by tags (comma-separated)</li>
                  <li><code className="bg-muted p-1 rounded">location</code> - Filter by location</li>
                </ul>
                
                <h3 className="font-semibold mt-4 mb-2">Response</h3>
                <pre className="bg-muted p-4 rounded overflow-auto">
{`{
  "data": [
    {
      "id": "uuid",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "location": "string",
      "tags": ["string"],
      "totalSpent": number,
      "lastPurchaseDate": "string"
    }
  ],
  "count": number,
  "total": number
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>POST /api/orders</CardTitle>
                <CardDescription>Submit a new customer order</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Request Body Schema</h3>
                <pre className="bg-muted p-4 rounded overflow-auto">
{`{
  "customerEmail": "string", // required
  "orderDate": "string", // ISO date format
  "products": [
    {
      "id": "string",
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "totalAmount": number,
  "status": "string" // "completed", "pending", "cancelled"
}`}
                </pre>
                
                <h3 className="font-semibold mt-4 mb-2">Response</h3>
                <p className="text-muted-foreground mb-2">Success (200 OK)</p>
                <pre className="bg-muted p-4 rounded overflow-auto">
{`{
  "id": "uuid",
  "customerEmail": "string",
  "orderDate": "string",
  "totalAmount": number,
  "status": "string",
  "created_at": "string"
}`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>GET /api/orders</CardTitle>
                <CardDescription>Retrieve a list of orders with optional filtering</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Query Parameters</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li><code className="bg-muted p-1 rounded">limit</code> - Maximum number of results (default: 50)</li>
                  <li><code className="bg-muted p-1 rounded">offset</code> - Pagination offset (default: 0)</li>
                  <li><code className="bg-muted p-1 rounded">customerEmail</code> - Filter by customer email</li>
                  <li><code className="bg-muted p-1 rounded">status</code> - Filter by status</li>
                  <li><code className="bg-muted p-1 rounded">fromDate</code> - Filter from date (ISO format)</li>
                  <li><code className="bg-muted p-1 rounded">toDate</code> - Filter to date (ISO format)</li>
                </ul>
                
                <h3 className="font-semibold mt-4 mb-2">Response</h3>
                <pre className="bg-muted p-4 rounded overflow-auto">
{`{
  "data": [
    {
      "id": "uuid",
      "customerEmail": "string",
      "orderDate": "string",
      "totalAmount": number,
      "status": "string",
      "products": [
        {
          "name": "string",
          "quantity": number,
          "price": number
        }
      ]
    }
  ],
  "count": number,
  "total": number
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ApiDocPage;
