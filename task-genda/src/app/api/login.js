import { login } from '../../controllers/authController';

export default function handler(req, res) {
  if (req.method === 'POST') {
    return login(req, res);
  }
  res.status(405).json({ message: 'Method Not Allowed' });
}
