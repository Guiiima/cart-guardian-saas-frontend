import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface HelpArticle {
  id: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-helpscrem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './helpscrem.html',
  styleUrls: ['./helpscrem.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpscremComponent {
  readonly allArticles = signal<HelpArticle[]>([
    {
      id: 1,
      title: 'Conectando sua loja (Shopify / WooCommerce)',
      content: `
        <p>Para que o sistema possa ler seus dados, você precisa conectar sua loja. O método de conexão é diferente para Shopify e WooCommerce.</p>

        <h2>🚀 Conectando ao Shopify</h2>
        <p>A conexão com o Shopify é automática através da instalação do nosso aplicativo.</p>
        <ol>
            <li>Na aba <strong>"Integrações"</strong>, encontre <strong>Shopify</strong> e clique em <strong>"Conectar"</strong>.</li>
            <li>Insira a URL da sua loja (ex: <code>sua-loja.myshopify.com</code>).</li>
            <li>Você será redirecionado para a tela de autorização do Shopify.</li>
            <li>Revise as permissões e clique em <strong>"Instalar App"</strong>.</li>
            <li>Pronto! Após a instalação, você será redirecionado de volta e sua loja estará conectada.</li>
        </ol>

        <h2>📦 Conectando ao WooCommerce</h2>
        <p>A conexão com o WooCommerce requer a geração de chaves de API (API Keys) no seu painel do WordPress.</p>
        <ol>
            <li>Na aba <strong>"Integrações"</strong>, encontre <strong>WooCommerce</strong> e clique em <strong>"Conectar"</strong>.</li>
            <li>Você verá campos para: <strong>URL da Loja</strong>, <strong>Consumer Key</strong> e <strong>Consumer Secret</strong>.</li>
            <li>Preencha a URL da sua loja (ex: <code>https://sua-loja.com</code>).</li>
            <li>Siga os passos abaixo para gerar suas chaves e cole-as nos campos correspondentes.</li>
            <li>Clique em <strong>"Salvar Conexão"</strong>.</li>
        </ol>

        <h3>Como Gerar as Chaves de API no WooCommerce</h3>
        <p>Você precisa estar logado como Administrador no painel do seu WordPress.</p>
        <ol>
            <li>No menu lateral, vá para <strong>WooCommerce → Configurações</strong>.</li>
            <li>Clique na aba <strong>Avançado</strong>.</li>
            <li>Clique no item <strong>API REST</strong> (pode estar em um submenu).</li>
            <li>Clique no botão <strong>"Adicionar chave"</strong> ou "Criar uma chave de API".</li>
            <li>Preencha a <strong>Descrição</strong> (ex: "Metric Flow").</li>
            <li>Selecione o <strong>Usuário</strong> (geralmente seu usuário admin).</li>
            <li>Defina as <strong>Permissões</strong> para <strong>"Ler/Escrever" (Read/Write)</strong>. Isso é essencial.</li>
            <li>Clique em <strong>"Gerar Chave de API"</strong>.</li>
            <li>O WooCommerce mostrará a <strong>Consumer Key</strong> e a <strong>Consumer Secret</strong>.</li>
        </ol>
        <blockquote>
            <strong>Importante:</strong> Copie e salve as duas chaves imediatamente. O WooCommerce não as mostrará novamente depois que você sair desta página.
        </blockquote>
        <p>Após copiar as chaves, volte ao Metric Flow e cole-as nos campos de conexão.</p>
      `,
    },
    {
      id: 2,
      title: 'Entendendo o Dashboard (Painel Principal)',
      content: `
        <p>O Dashboard é sua visão geral da performance do aplicativo, dividido em três partes principais:</p>

        <h3>1. Cartões de Métricas (Visão Geral)</h3>
        <p>No topo da página, você encontra os principais indicadores de performance:</p>
        <ul>
            <li><strong>Receita Recuperada:</strong> Valor total das vendas concluídas através dos seus e-mails de recuperação.</li>
            <li><strong>Taxa de Conversão:</strong> A porcentagem de e-mails de recuperação que resultaram em uma compra.</li>
            <li><strong>Carrinhos Abandonados:</strong> O número total de carrinhos (ou pedidos inacabados) que foram identificados.</li>
            <li><strong>Ticket Médio:</strong> O valor médio das compras que foram recuperadas com sucesso.</li>
        </ul>

        <h3>2. Gráfico de Receita Recuperada</h3>
        <p>Este gráfico mostra a performance da sua receita recuperada ao longo do tempo. Você pode filtrar a visualização por:</p>
        <ul>
            <li>Período (Semana, Dias do Mês, Ano).</li>
            <li>Tipo de gráfico (Barras, Linha, Pizza, Rosca, Radar).</li>
        </ul>

        <h3>3. Tabela de Atividades Recentes</h3>
        <p>Esta tabela oferece uma visão detalhada sobre os produtos que estão sendo abandonados e recuperados.</p>
        <ul>
            <li><strong>Aba "Ranking Produtos Abandonados":</strong> Mostra quais produtos são mais frequentemente deixados para trás, ajudando você a identificar gargalos ou problemas.</li>
            <li><strong>Aba "Produtos Recuperados":</strong> Lista os produtos específicos que foram comprados com sucesso após o envio de um e-mail de recuperação.</li>
        </ul>
      `,
    },
    {
      id: 3,
      title: 'Configurando Automação de E-mails',
      content: `
        <p>Nossa automação de e-mails permite que você recupere vendas perdidas de forma inteligente. A configuração do fluxo é universal, mas o 'gatilho' que inicia a automação é diferente entre Shopify e WooCommerce.</p>

        <h2>Passo a Passo da Configuração</h2>
        <p>Siga estes passos para criar seu fluxo de recuperação:</p>
        <ol>
            <li>Vá em <strong>Campanhas → Fluxos de E-mail</strong>.</li>
            <li>Clique em <strong>"Nova Automação"</strong> e escolha o tipo de fluxo (ex: Recuperação de Carrinho).</li>
            <li>Dentro do editor, você verá as etapas do seu funil (ex: "E-mail 1", "E-mail 2").</li>
            <li>Para cada etapa de e-mail, você terá duas abas principais de configuração:</li>
        </ol>

        <h3>Aba "Tempo de Espera"</h3>
        <p>Aqui você define a lógica e aparência desta etapa:</p>
        <ul>
            <li><strong>Tempo de Espera:</strong> Defina quanto tempo o sistema deve esperar antes de enviar este e-mail (ex: "1 hora após o abandono").</li>
            <li><strong>Status do E-mail:</strong> Você pode <strong>ativar ou desativar</strong> este e-mail específico sem apagar o resto do fluxo.</li>
            <li><strong>Logo da Loja:</strong> Adicione a logo da sua loja para personalizar o cabeçalho do e-mail.</li>
        </ul>

        <h3>Aba "Template Email"</h3>
        <p>Aqui você escolhe o conteúdo:</p>
        <ul>
            <li><strong>Selecionar Template:</strong> Escolha qual dos seus templates de e-mail será usado para esta etapa.</li>
            <li>Você pode pré-visualizar e editar o template diretamente.</li>
        </ul>
        
        <p>Após configurar todas as etapas, clique em <strong>"Salvar e Ativar"</strong> no canto superior para ligar seu fluxo.</p>

        <h2>Entendendo os Gatilhos (Shopify vs. WooCommerce)</h2>

        <h3>🚀 Para Lojistas Shopify</h3>
        <p>A recuperação de carrinho no Shopify funciona em tempo real. Assim que um cliente digita o e-mail no checkout (mesmo que ele não clique em "finalizar compra"), o Metric Flow já começa a monitorar. Este é o gatilho que inicia seu fluxo.</p>

        <h3>📦 Para Lojistas WooCommerce</h3>
        <p>No WooCommerce, o gatilho é um <strong>pedido inacabado</strong>. A automação começa quando um cliente gera um pedido (ex: Boleto ou Pix) e o status do pedido fica como "Pagamento Pendente" ou "Em Espera".</p>
        <blockquote>
            <strong>Importante:</strong> A automação do WooCommerce não captura e-mails digitados no checkout que não geraram um pedido. Ela atua sobre <strong>pedidos já criados</strong> que aguardam pagamento.
        </blockquote>
      `,
    },
    {
      id: 4,
      title: 'O que são Carrinhos Abandonados?',
      content: `
        <p>Um "carrinho abandonado" é uma venda em potencial que não foi concluída. No entanto, a forma como o Metric Flow identifica isso depende da sua plataforma:</p>
        <ul>
            <li><strong>No Shopify:</strong> Identificamos quando um cliente digita o e-mail no checkout e abandona a página, <strong>mesmo sem gerar um pedido</strong>.</li>
            <li><strong>No WooCommerce:</strong> Identificamos <strong>pedidos inacabados</strong>. Isso acontece quando um cliente gera um pedido (ex: um boleto ou Pix), mas não conclui o pagamento.</li>
        </ul>
        <p>Para mais detalhes, consulte nosso artigo "Qual a diferença da recuperação do WooCommerce e Shopify?".</p>
      `,
    },
    {
      id: 5,
      title: 'Qual a diferença da recuperação do WooCommerce e Shopify?',
      content: `
        <p>Essa é uma dúvida muito comum e a diferença está em como cada plataforma nos envia os dados.</p>

        <h3>Shopify: Captura de Checkout</h3>
        <p>O Shopify nos permite "escutar" o checkout. No momento em que um cliente digita o e-mail, mesmo <strong>antes</strong> de finalizar o pedido ou escolher o frete, nós já capturamos essa informação. Se ele fechar a aba, consideramos um carrinho abandonado.</p>

        <h3>WooCommerce: Captura de Pedido Inacabado</h3>
        <p>O WooCommerce (por padrão) não possui esse recurso. Ele só nos informa sobre uma "venda" quando o cliente clica em "Finalizar Compra" e um pedido é formalmente criado na plataforma.</p>
        <p>Por isso, no WooCommerce, nossa automação funciona para pedidos que já existem, mas que estão com o pagamento pendente (ex: <strong>Boleto Gerado</strong>, <strong>Pix não pago</strong>, <strong>Transferência Pendente</strong>).</p>

        <h3>Resumo da Diferença</h3>
        <ul>
            <li><strong>Shopify:</strong> Recupera clientes que digitaram o e-mail e abandonaram (mesmo sem gerar pedido).</li>
            <li><strong>WooCommerce:</strong> Recupera clientes que geraram um pedido, mas não o pagaram (boleto, pix, etc.).</li>
        </ul>
      `,
    },
  ]);

  readonly selectedArticle = signal<HelpArticle | null>(null);
  readonly searchTerm = signal<string>('');

  readonly filteredArticles = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const articles = this.allArticles();

    if (!term) return articles;

    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.content.toLowerCase().includes(term)
    );
  });

  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  selectArticle(article: HelpArticle) {
    this.selectedArticle.set(article);
  }

  goBack() {
    this.selectedArticle.set(null);
  }
}