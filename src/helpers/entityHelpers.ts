'use client';
import { EmpresaService } from '@/service/empresa.service';
import { SistemaService } from '@/service/sistemas.service';
import { Empresa } from '@/types/empresa.type';
import { PessoaUsuarioRegisterDTO } from '@/types/pessoaUsuario.type';
import { Sistema } from '@/types/sistemas.type';

const cache = {
  sistemas: new Map<number, Sistema>(),
  empresas: new Map<number, Empresa>(),
  usuarios: new Map<number, PessoaUsuarioRegisterDTO>(),
};

export const getSistemaById = async (id: number): Promise<string> => {
  if (!id) return 'N/A';

  // Verifica se já está em cache
  if (cache.sistemas.has(id)) {
    const sistema = cache.sistemas.get(id);
    return sistema?.nome || 'N/A';
  }

  try {
    const sistema = await SistemaService.getSistema(id);
    if (sistema) {
      cache.sistemas.set(id, sistema);
      return sistema.nome;
    }
    return 'N/A';
  } catch (error) {
    console.error('Erro ao buscar sistema:', error);
    return 'Erro';
  }
};

export const getEmpresaById = async (id: number): Promise<string> => {
  if (!id) return 'N/A';

  // Verifica se já está em cache
  if (cache.empresas.has(id)) {
    const empresa = cache.empresas.get(id);
    return empresa?.nomeFantasia || empresa?.razaoSocial || 'N/A';
  }
  if (id === -1) return 'Sem Empresa';

  try {
    const empresa = await EmpresaService.getEmpresa(id);
    if (empresa) {
      cache.empresas.set(id, empresa);
      return empresa.nomeFantasia || empresa.razao_social;
    }
    return 'N/A';
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return 'Erro';
  }
};

// Função auxiliar para formatar o nome do usuário
const formatarNomeUsuario = (usuario: PessoaUsuarioRegisterDTO): string => {
  if (!usuario) return 'N/A';
  const { nome, nomeSocial } = usuario.pessoa;
  return nomeSocial || nome || usuario.login || 'N/A';
};

export const getUsuarioById = async (id: number): Promise<string> => {
  if (!id) return 'N/A';

  // Verifica se já está em cache
  if (cache.usuarios.has(id)) {
    const usuario = cache.usuarios.get(id);
    return formatarNomeUsuario(usuario!);
  }

  try {
    const usuario = await fetch(`/api/usuarios/${id}`).then((res) =>
      res.json()
    );
    if (usuario) {
      cache.usuarios.set(id, usuario);
      return formatarNomeUsuario(usuario);
    }
    return 'N/A';
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return 'Erro';
  }
};
