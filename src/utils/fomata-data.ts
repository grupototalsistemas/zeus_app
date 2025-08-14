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
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
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