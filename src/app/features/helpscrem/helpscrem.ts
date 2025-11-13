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
        <p>Para que o sistema possa ler os carrinhos abandonados, você precisa conectar sua loja.</p>
        <ol>
          <li>Vá para a seção <strong>"Configurações"</strong> no menu principal.</li>
          <li>Clique na aba <strong>"Integrações"</strong>.</li>
          <li>Encontre a plataforma da sua loja (ex: <strong>Shopify</strong>) e clique em <strong>"Conectar"</strong>.</li>
          <li>Você será solicitado a inserir a URL da sua loja (ex: <code>sua-loja.myshopify.com</code>).</li>
          <li>Após inserir a URL, você será redirecionado para a tela de autorização do Shopify.</li>
          <li>Clique em <strong>"Instalar App"</strong> (ou "Autorizar").</li>
          <li>Se a conexão for bem-sucedida, você verá um status "Conectado".</li>
        </ol>
      `,
    },
    {
      id: 2,
      title: 'Entendendo o Dashboard (Painel Principal)',
      content: `
        <p>O Dashboard é sua visão geral da performance do aplicativo.</p>
        <ul>
          <li><strong>Receita Recuperada:</strong> Valor total das vendas concluídas por e-mails de recuperação.</li>
          <li><strong>Taxa de Recuperação:</strong> Porcentagem de carrinhos recuperados.</li>
          <li><strong>Carrinhos Abandonados:</strong> Quantos foram identificados.</li>
          <li><strong>E-mails Enviados:</strong> Quantos e-mails de recuperação foram disparados.</li>
        </ul>
      `,
    },
    {
      id: 3,
      title: 'Configurando Automação de E-mails',
      content: `
        <p>Configure os fluxos automáticos de e-mails para recuperar vendas perdidas.</p>
        <ol>
          <li>Vá em <strong>Campanhas → Fluxos de E-mail</strong>.</li>
          <li>Clique em <strong>"Nova Automação"</strong> e escolha o tipo de fluxo.</li>
          <li>Edite os textos e tempos de envio conforme desejar.</li>
          <li>Salve e ative sua automação.</li>
        </ol>
      `,
    },
    {
      id: 4,
      title: 'O que são Carrinhos Abandonados?',
      content: `
        <p>Um carrinho é considerado "abandonado" quando um cliente adiciona itens ao carrinho, inicia o processo de checkout (geralmente fornecendo um e-mail), mas não conclui a compra.</p>
        <p>Nosso sistema identifica esses eventos e agenda automaticamente o envio de e-mails de recuperação para tentar trazer o cliente de volta.</p>
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
