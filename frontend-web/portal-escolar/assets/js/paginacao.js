class Paginacao {
  constructor(opcoes) {
    this.dados = opcoes.dados || [];
    this.container = typeof opcoes.container === 'string'
      ? document.getElementById(opcoes.container)
      : opcoes.container;
    this.renderizarItem = opcoes.renderizarItem || (() => '');
    this.aoMudar = opcoes.aoMudar || null;
    this.pagina = 1;
    this.itensPorPagina = opcoes.paginaPadrao || 1;
    this.mostrarResumo = opcoes.mostrarResumo !== false;
    this.mostrarSeletor = opcoes.mostrarSeletor !== false;
    this.mostrarNavegacao = opcoes.mostrarNavegacao !== false;
    this.containerTabela = opcoes.containerTabela || null;
    this.containerVazio = opcoes.containerVazio || null;
    this.mensagemVazia = opcoes.mensagemVazia || 'Nenhum registro encontrado.';
    this.indiceOffset = opcoes.indiceOffset || 0;
    this._render();
  }

  get total() { return this.dados.length; }
  get totalPaginas() { return Math.max(1, Math.ceil(this.total / this.itensPorPagina)); }
  get inicio() { return (this.pagina - 1) * this.itensPorPagina; }
  get fim() { return Math.min(this.inicio + this.itensPorPagina, this.total); }
  get dadosPagina() { return this.dados.slice(this.inicio, this.fim); }

  irPara(pagina) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.pagina = pagina;
    this._render();
    if (this.aoMudar) this.aoMudar(this.pagina, this.itensPorPagina);
  }

  mudarTamanho(novo) {
    this.itensPorPagina = parseInt(novo, 10);
    this.pagina = 1;
    this._render();
    if (this.aoMudar) this.aoMudar(this.pagina, this.itensPorPagina);
  }

  atualizarDados(novosDados) {
    this.dados = novosDados;
    this.pagina = 1;
    this._render();
  }

  _render() {
    if (!this.container) return;
    const dadosPagina = this.dadosPagina;

    if (dadosPagina.length === 0) {
      if (this.containerVazio) {
        this.containerVazio.classList.remove('hidden');
        if (this.containerTabela) this.containerTabela.classList.add('hidden');
      }
      if (this.containerTabela) this.containerTabela.innerHTML = '';
      this.container.innerHTML = '';
      return;
    }

    if (this.containerVazio) this.containerVazio.classList.add('hidden');
    if (this.containerTabela) this.containerTabela.classList.remove('hidden');

    if (this.containerTabela) {
      this.containerTabela.innerHTML = dadosPagina.map(this.renderizarItem).join('');
    } else {
      this.container.innerHTML = dadosPagina.map(this.renderizarItem).join('');
    }

    let html = '<div class="paginacao-controls">';

    if (this.mostrarResumo) {
      const offset = this.indiceOffset;
      html += `<span class="paginacao-info">Mostrando <strong>${offset + this.inicio + 1}</strong>–<strong>${offset + this.fim}</strong> de <strong>${offset + this.total}</strong> registros</span>`;
    }

    if (this.mostrarSeletor && this.total > 1) {
      const opcoes = [1, 10, 20, 50].map(n =>
        `<option value="${n}"${n === this.itensPorPagina ? ' selected' : ''}>${n} por página</option>`
      ).join('');
      html += `<span class="paginacao-seletor"><label>Exibir:</label> <select class="paginacao-tamanho">${opcoes}</select></span>`;
    }

    if (this.mostrarNavegacao && this.totalPaginas > 1) {
      html += '<span class="paginacao-navegacao">';
      if (this.pagina > 1) html += `<button class="btn-pagina" data-pagina="${this.pagina - 1}">« Anterior</button>`;

      const maxBotoes = 5;
      const metade = Math.floor(maxBotoes / 2);
      let inicioP = Math.max(1, this.pagina - metade);
      let fimP = Math.min(this.totalPaginas, inicioP + maxBotoes - 1);
      if (fimP - inicioP + 1 < maxBotoes) inicioP = Math.max(1, fimP - maxBotoes + 1);

      if (inicioP > 1) html += '<span class="paginacao-ellipsis">…</span>';

      for (let i = inicioP; i <= fimP; i++) {
        html += `<button class="btn-pagina${i === this.pagina ? ' ativo' : ''}" data-pagina="${i}">${i}</button>`;
      }

      if (fimP < this.totalPaginas) html += '<span class="paginacao-ellipsis">…</span>';

      if (this.pagina < this.totalPaginas) html += `<button class="btn-pagina" data-pagina="${this.pagina + 1}">Próximo »</button>`;
      html += '</span>';
    }

    html += '</div>';
    this.container.innerHTML = html;

    this.container.querySelectorAll('.btn-pagina').forEach(btn => {
      btn.addEventListener('click', () => this.irPara(parseInt(btn.dataset.pagina, 10)));
    });
    const sel = this.container.querySelector('.paginacao-tamanho');
    if (sel) sel.addEventListener('change', () => this.mudarTamanho(sel.value));
  }
}
