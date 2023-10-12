// Import necessary types from Next.js
import type { NextApiRequest, NextApiResponse } from 'next';

// Define the expected response data structure
type Data = {
  name: string;
};

// Define the API route handler
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Respond with a JSON object containing a name
  res.status(200).json({ name: 'Arjun Aditya' });
}
