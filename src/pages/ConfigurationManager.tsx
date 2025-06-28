
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ExternalLink } from 'lucide-react';

// Default webhook base URL
const DEFAULT_WEBHOOK_BASE = "https://webhook.n8nlabz.com.br/webhook";

// Default endpoints configuration
const defaultEndpoints = {
  mensagem: `${DEFAULT_WEBHOOK_BASE}/envia_mensagem`,
  pausaBot: `${DEFAULT_WEBHOOK_BASE}/pausa_bot`,
  iniciaBot: `${DEFAULT_WEBHOOK_BASE}/inicia_bot`,
  agenda: `${DEFAULT_WEBHOOK_BASE}/agenda`,
  agendaAlterar: `${DEFAULT_WEBHOOK_BASE}/agenda/alterar`,
  agendaAdicionar: `${DEFAULT_WEBHOOK_BASE}/agenda/adicionar`,
  agendaExcluir: `${DEFAULT_WEBHOOK_BASE}/agenda/excluir`,
  enviaRag: `${DEFAULT_WEBHOOK_BASE}/envia_rag`,
  excluirArquivoRag: `${DEFAULT_WEBHOOK_BASE}/excluir-arquivo-rag`,
  excluirRag: `${DEFAULT_WEBHOOK_BASE}/excluir-rag`,
  instanciaEvolution: `${DEFAULT_WEBHOOK_BASE}/instanciaevolution`,
  atualizarQrCode: `${DEFAULT_WEBHOOK_BASE}/atualizar-qr-code`,
  confirma: `${DEFAULT_WEBHOOK_BASE}/confirma`,
};

const endpointGroups = {
  'Configuração Supabase': [
    { id: 'supabaseUrl', label: 'URL do Supabase', value: import.meta.env.VITE_SUPABASE_URL || '', readOnly: true },
    { id: 'supabaseKey', label: 'Chave Anônima do Supabase', value: import.meta.env.VITE_SUPABASE_ANON_KEY || '', readOnly: true }
  ],
  'Configuração da Agenda': [
    { id: 'agenda', label: 'URL Base da Agenda', key: 'agenda' },
    { id: 'agendaAdicionar', label: 'Adicionar Evento', key: 'agendaAdicionar' },
    { id: 'agendaAlterar', label: 'Alterar Evento', key: 'agendaAlterar' },
    { id: 'agendaExcluir', label: 'Excluir Evento', key: 'agendaExcluir' }
  ],
  'Configuração do Bot': [
    { id: 'mensagem', label: 'Enviar Mensagem', key: 'mensagem' },
    { id: 'pausaBot', label: 'Pausar Bot', key: 'pausaBot' },
    { id: 'iniciaBot', label: 'Iniciar Bot', key: 'iniciaBot' },
    { id: 'confirma', label: 'Confirmar', key: 'confirma' }
  ],
  'Configuração RAG': [
    { id: 'enviaRag', label: 'Enviar RAG', key: 'enviaRag' },
    { id: 'excluirArquivoRag', label: 'Excluir Arquivo RAG', key: 'excluirArquivoRag' },
    { id: 'excluirRag', label: 'Excluir RAG', key: 'excluirRag' }
  ],
  'Configuração Evolution': [
    { id: 'instanciaEvolution', label: 'Instância Evolution', key: 'instanciaEvolution' },
    { id: 'atualizarQrCode', label: 'Atualizar QR Code', key: 'atualizarQrCode' }
  ]
};

const ConfigurationManager = () => {
  const [endpoints, setEndpoints] = React.useState(() => {
    const savedEndpoints = localStorage.getItem('webhookEndpoints');
    return savedEndpoints ? JSON.parse(savedEndpoints) : defaultEndpoints;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEndpointChange = (key: string, value: string) => {
    setEndpoints(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('webhookEndpoints', JSON.stringify(endpoints));
    toast({
      title: "Configurações salvas",
      description: "As configurações foram salvas com sucesso.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Salvar Alterações
        </Button>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Guia de Configuração:</strong>
          <br />
          1. <strong>URLs de Webhook:</strong> Configure os endpoints do seu sistema N8N
          <br />
          2. <strong>Google Agenda:</strong> Os endpoints de agenda devem apontar para fluxos N8N que integram com Google Calendar API
          <br />
          3. <strong>Evolution API:</strong> Configure a instância do Evolution para WhatsApp
          <br />
          4. <strong>Salve sempre</strong> após fazer alterações para que sejam aplicadas
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {Object.entries(endpointGroups).map(([groupTitle, fields]) => (
          <Card key={groupTitle} className="w-full">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {groupTitle}
                {groupTitle.includes('Agenda') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Google Cloud Console
                  </Button>
                )}
              </h3>
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      value={field.readOnly ? field.value : endpoints[field.key as keyof typeof endpoints]}
                      onChange={field.readOnly ? undefined : (e) => handleEndpointChange(field.key, e.target.value)}
                      readOnly={field.readOnly}
                      className="w-full font-mono text-sm"
                      placeholder={field.readOnly ? 'Configurado automaticamente' : 'Digite a URL do endpoint'}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="w-full bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">📚 Documentação de Configuração</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">1. Configuração do Google Agenda:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Acesse o Google Cloud Console e crie um projeto</li>
                  <li>Ative a Google Calendar API</li>
                  <li>Crie credenciais OAuth 2.0</li>
                  <li>Configure os URLs de redirect no N8N</li>
                  <li>Use as credenciais nos fluxos N8N da agenda</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">2. N8N e Webhooks:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Cada endpoint deve corresponder a um fluxo no N8N</li>
                  <li>Configure webhooks que recebem dados via POST</li>
                  <li>Implemente a lógica de negócio nos fluxos</li>
                  <li>Retorne respostas apropriadas para o frontend</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">3. Evolution API (WhatsApp):</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Configure uma instância do Evolution API</li>
                  <li>Obtenha o QR Code para conectar o WhatsApp</li>
                  <li>Configure os webhooks para receber mensagens</li>
                  <li>Integre com os fluxos N8N para automação</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfigurationManager;
