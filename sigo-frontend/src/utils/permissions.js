export const CARGOS = {
  ADMINISTRADOR: "administrador",
  ANALISTA: "analista", 
  BOMBEIRO: "bombeiro", 
  CAPITAO: "capitão",
  DESENVOLVEDOR: "desenvolvedor",
  SARGENTO: "sargento"
};

export function verificarAcessoPainelAdministrativo(cargo) {
  console.log('Verificando acesso Painel Administrativo para cargo:', cargo);
  const hasAccess = [CARGOS.ADMINISTRADOR, CARGOS.DESENVOLVEDOR].includes(cargo);
  console.log('Resultado:', hasAccess);
  return hasAccess;
}

export function verificarAcessoRelatorios(cargo) {
  console.log('Verificando acesso Relatórios para cargo:', cargo);
  const hasAccess = [CARGOS.ADMINISTRADOR, CARGOS.DESENVOLVEDOR, CARGOS.ANALISTA, CARGOS.CAPITAO].includes(cargo);
  console.log('Resultado:', hasAccess);
  return hasAccess;
}

export function verificarPermissaoEdicaoOcorrencia(cargo, isOwner = false) {
  console.log('Verificando permissão de edição de ocorrência para cargo:', cargo, 'isOwner:', isOwner);
  
  // Desenvolvedor pode editar qualquer ocorrência
  if (cargo === CARGOS.DESENVOLVEDOR) {
    console.log('Resultado: true (desenvolvedor)');
    return true;
  }
  
  // Outros usuários só podem editar suas próprias ocorrências
  const hasAccess = isOwner;
  console.log('Resultado:', hasAccess);
  return hasAccess;
}

export function verificarAcesso(cargo, allowedRoles) {
  return allowedRoles.includes(cargo);
}