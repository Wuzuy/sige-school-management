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

// Helper: busca permissoes do usuario (incluindo do cargo)
async function getUserPermissoes(userId) {
  const supabase = require('../config/supabase');

  // Busca usuario com id_cargo
  const { data: user } = await supabase.from('usuarios').select('id_cargo, role').eq('id', userId).single();
  if (!user) return [];

  // Se é admin master, retorna todas permissoes
  if (user.id_cargo) {
    const { data: cargo } = await supabase.from('cargos').select('is_admin_master').eq('id', user.id_cargo).single();
    if (cargo?.is_admin_master) {
      const { data: all } = await supabase.from('permissoes').select('codigo');
      return (all || []).map(p => p.codigo);
    }
  }

  // Se nao tem cargo, usa role antiga como fallback
  if (!user.id_cargo) {
    if (user.role === 'ROLE_ADMIN') {
      const { data: all } = await supabase.from('permissoes').select('codigo');
      return (all || []).map(p => p.codigo);
    }
    return [];
  }

  // Busca permissoes do cargo
  const { data: perms } = await supabase
    .from('cargos_permissoes')
    .select('id_permissao')
    .eq('id_cargo', user.id_cargo);

  if (!perms || !perms.length) return [];

  const ids = perms.map(p => p.id_permissao);
  const { data: permissoes } = await supabase.from('permissoes').select('codigo').in('id', ids);
  return (permissoes || []).map(p => p.codigo);
}

// Middleware: requer Admin Master
async function requireAdminMaster(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Nao autorizado' });
  try {
    const supabase = require('../config/supabase');
    const { data: user } = await supabase.from('usuarios').select('id_cargo, role').eq('id', req.user.id).single();
    if (!user) return res.status(403).json({ error: 'Usuario nao encontrado' });

    // Verifica se tem cargo admin master
    if (user.id_cargo) {
      const { data: cargo } = await supabase.from('cargos').select('is_admin_master').eq('id', user.id_cargo).single();
      if (cargo?.is_admin_master) return next();
    }

    // Fallback: role antiga
    if (user.role === 'ROLE_ADMIN') return next();

    return res.status(403).json({ error: 'Acesso proibido: requer Admin Master' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// Middleware factory: requer permissao especifica
function requirePermissao(codigoPermissao) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Nao autorizado' });
    try {
      const permissoes = await getUserPermissoes(req.user.id);
      if (permissoes.includes(codigoPermissao)) return next();
      return res.status(403).json({ error: 'Acesso proibido: permissao insuficiente' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { requireAuth, requireRole, requireAdminMaster, requirePermissao, getUserPermissoes };
