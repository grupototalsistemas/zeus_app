'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { useState } from 'react';

export default function SuportePage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivos, setArquivos] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setArquivos((prev) => [
        ...prev,
        ...Array.from(event.target.files as FileList),
      ]);
    }
  };

  const handleEnviar = () => {
    console.log({
      titulo,
      descricao,
      arquivos,
    });

    // Aqui você pode fazer o POST para API
  };

  const removeArquivo = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Suporte" pageBefore="configurações" />

      <ComponentCard title="Suporte para Desenvolvedores">
        <form className="space-y-6">
          {/* Campo título */}
          <div>
            <Label>Título</Label>
            <Input
              type="text"
              placeholder="Descreva brevemente o problema"
              defaultValue={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Campo descrição */}
          <div>
            <Label>Descrição</Label>
            <TextArea
              placeholder="Detalhe o problema encontrado"
              value={descricao}
              onChange={(value) => setDescricao(value)}
              rows={5}
            />
          </div>

          {/* Upload de arquivos */}
          <div>
            <Label>Enviar Arquivos / Prints</Label>
            <div className="mt-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="uploadInput"
              />
              <label
                htmlFor="uploadInput"
                className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
              >
                Clique aqui para selecionar arquivos
              </label>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Suporte para imagens (PNG, JPG) e documentos (PDF, TXT, LOG)
              </p>
            </div>

            {/* Lista de arquivos */}
            {arquivos.length > 0 && (
              <div className="mt-4 space-y-2">
                {arquivos.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removeArquivo(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botão enviar */}
          <div className="text-right">
            <Button size="md" variant="primary" onClick={handleEnviar}>
              Enviar Chamado de Suporte
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
