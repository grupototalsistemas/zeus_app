export const formataData = (data: string): string => {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`;
}

export const formataDataHora = (data: string, hora: string): string => {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}T${hora}`;
}

export const formataDataHoraParaExibir = (data: string): string => {
  const [ano, mes, dia] = data.split('T')[0].split('-');
  const [hora, minuto] = data.split('T')[1].split(':');
  return `${dia}/${mes}/${ano}\n ${hora}:${minuto}`;
}

export const formataDataParaExibir = (data: string): string => {
  //precisa retirar a hora se tiver
  if (data.includes('T')) {
    data = data.split('T')[0];
  }
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

export const formataHoraParaExibir = (hora: string): string => {
  // precisa retirar a data se tiver
  if (hora.includes('T')) {
    hora = hora.split('T')[1];
  }
  const [horaPart, minuto] = hora.split(':');
  return `${horaPart}:${minuto}`;
}

export const dataAgora = (): string => {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export const horaAgora = (): string => {
  const hoje = new Date();
  const hora = String(hoje.getHours()).padStart(2, '0');
  const minuto = String(hoje.getMinutes()).padStart(2, '0');
  return `${hora}:${minuto}`;
}

// recebe a data e conta quantos dias se passaram até hoje
export const diasAtras = (data: string): number => {
  const [dia, mes, ano] = data.split('/');
  const dataPassada = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - dataPassada.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}