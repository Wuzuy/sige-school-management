const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreta_sige_123';

// Middleware: verifica se usuario esta autenticado
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Nao autorizado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token invalido' });
  }
}

// Middleware: verifica se usuario tem role especifica
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Nao autorizado' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso proibido: permissao insuficiente' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
