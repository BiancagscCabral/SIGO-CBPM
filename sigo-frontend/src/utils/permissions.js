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

export function verificarAcesso(cargo, allowedRoles) {
  return allowedRoles.includes(cargo);
}