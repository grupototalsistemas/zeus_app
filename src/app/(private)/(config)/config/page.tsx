'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { useState } from 'react';

import Switch from '@/components/form/switch/Switch';
import { notificationService } from '@/service/notificationService';

export default function ConfiguracoesGeraisPage() {
  const [prazo, setPrazo] = useState('7');
  const [notificacaoAmpla, setNotificacaoAmpla] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const handleToggleNotificacao = async (checked: boolean) => {
    if (checked) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        notificationService.setType('desktop');
        setNotificacaoAmpla(true);
        setMensagem('Notificações em segundo plano ativadas.');
        notificationService.notify(
          'Configuração salva!',
          'Você receberá alertas mesmo fora do sistema.'
        );
      } else {
        setNotificacaoAmpla(false);
        notificationService.setType('silent');
        setMensagem('Permissão negada. Mantendo notificações silenciosas.');
      }
    } else {
      setNotificacaoAmpla(false);
      notificationService.setType('silent');
      setMensagem('Notificações silenciosas ativadas.');
    }
  };

  const handleSalvar = () => {
    console.log({
      prazo,
      notificacao: notificacaoAmpla ? 'desktop' : 'silent',
    });
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle="Configurações Gerais"
        pageBefore="Configurações"
      />

      <ComponentCard title="Configurações do Sistema">
        <form className="space-y-6">
          {/* Prazo Padrão */}
          <div>
            <Label>Prazo Padrão para Chamados (dias)</Label>
            <select
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="3">3 dias</option>
              <option value="5">5 dias</option>
              <option value="7">7 dias</option>
              <option value="10">10 dias</option>
            </select>
          </div>

          {/* Notificações */}
          <div className="flex items-center justify-items-start gap-4">
            <Label>Notificações</Label>
            <div className="flex items-center">
              <div className="relative inline-flex h-6 w-11 items-center rounded-full">
                <Switch
                  defaultChecked={notificacaoAmpla}
                  onChange={handleToggleNotificacao}
                  color={notificacaoAmpla ? 'blue' : 'gray'}
                  label={''}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {notificacaoAmpla
              ? 'Receber notificações em segundo plano (desktop).'
              : 'Receber notificações apenas ao acessar a aplicação.'}
          </p>

          {mensagem && (
            <p
              className={`text-sm ${
                mensagem.includes('negada') || mensagem.includes('não suporta')
                  ? 'text-red-500'
                  : 'text-green-500'
              }`}
            >
              {mensagem}
            </p>
          )}

          {/* Botão */}
          <div className="text-right">
            <Button size="md" variant="primary" onClick={handleSalvar}>
              Salvar Configurações
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
