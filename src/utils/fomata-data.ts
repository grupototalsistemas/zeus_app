// utils/formatar-data.ts

type FormatOptions = 'data' | 'hora' | 'dataHora';

function parseDateString(data: string): Date {
  if (!data) return new Date('');

  // ISO: yyyy-MM-dd ou yyyy-MM-ddTHH:mm
  if (/^\d{4}-\d{2}-\d{2}/.test(data)) {
    return new Date(data);
  }

  // BR: dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    const [dia, mes, ano] = data.split('/');
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  return new Date('');
}

export function formatarData(
  data: string | Date,
  tipo: FormatOptions = 'dataHora'
): string {
  const d = data instanceof Date ? data : parseDateString(data);

  if (isNaN(d.getTime())) return ''; // evita crash em datas inválidas

  switch (tipo) {
    case 'data':
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeZone: 'America/Sao_Paulo',
      }).format(d);

    case 'hora':
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo',
      }).format(d);

    case 'dataHora':
    default:
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo',
      }).format(d);
  }
}

// 🔹 Data de agora
export function dataAgora(): string {
  return formatarData(new Date(), 'data');
}

// 🔹 Hora de agora
export function horaAgora(): string {
  return formatarData(new Date(), 'hora');
}

// 🔹 Quantos dias se passaram até hoje (dd/MM/yyyy ou ISO → número)
export function diasAtras(data: string): number {
  const d = parseDateString(data);
  if (isNaN(d.getTime())) return 0;

  const hoje = new Date();
  const diffTime = hoje.getTime() - d.getTime();

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
