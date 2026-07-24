import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { EtapaTrajetoria } from '../../../services/etapa-trajetoria.service';
import {
  FilialTrajetoria,
  FilialTrajetoriaService,
} from '../../../services/filial-trajetoria.service';
import { Filial } from '../../../services/filial.service';
import {
  TrajetoriaEtapa,
  TrajetoriaEtapaCreate,
  TrajetoriaEtapaService,
} from '../../../services/trajetoria-etapa.service';
import {
  Trajetoria,
  TrajetoriaCreate,
  TrajetoriaService,
  TrajetoriaUpdate,
} from '../../../services/trajetoria.service';
import { TelaFormularioTrajetoria } from '../trajetorias.types';

interface Opcao<T> {
  label: string;
  value: T;
}

interface OpcaoTipoEtapa extends Opcao<number> {
  icon: string;
  color: string;
  textColor: string;
}

interface TrajetoriaForm {
  ds_nome: string;
  ds_descricao: string;
  nr_versao: number;
  st_ativo: boolean;
}

interface EtapaEditor {
  chave: number;
  seq_trajetoria_etapa?: number;
  seq_etapa_trajetoria: number | null;
  ds_nome: string;
  ds_descricao: string;
  nr_prazo_dias: number | null;
  st_obrigatoria: boolean;
  st_permite_pular: boolean;
  st_exige_observacao: boolean;
  expandida: boolean;
}

@Component({
  selector: 'app-form-trajetorias',
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TagModule,
    TextareaModule,
    ToggleSwitchModule,
  ],
  templateUrl: './form-trajetorias.html',
  styleUrl: './form-trajetorias.scss',
})
export class FormTrajetorias implements OnChanges {
  private readonly trajetoriaService = inject(TrajetoriaService);
  private readonly trajetoriaEtapaService = inject(TrajetoriaEtapaService);
  private readonly filialTrajetoriaService = inject(FilialTrajetoriaService);
  private readonly messageService = inject(MessageService);

  @Input({ required: true }) modo!: TelaFormularioTrajetoria;
  @Input() trajetoria: Trajetoria | null = null;
  @Input() trajetoriaDuplicada: Trajetoria | null = null;
  @Input({ required: true }) etapas: TrajetoriaEtapa[] = [];
  @Input({ required: true }) tiposEtapa: EtapaTrajetoria[] = [];
  @Input({ required: true }) filiais: Filial[] = [];
  @Input({ required: true }) filiaisTrajetorias: FilialTrajetoria[] = [];

  @Output() editar = new EventEmitter<Trajetoria>();
  @Output() duplicar = new EventEmitter<Trajetoria>();
  @Output() cancelar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<number>();

  form: TrajetoriaForm = this.novoForm();
  etapasEditor: EtapaEditor[] = [];
  idsEtapasOriginais: number[] = [];
  filiaisSelecionadas: number[] = [];
  filiaisPadrao: number[] = [];
  salvando = false;
  modoEdicao = false;
  private proximaChave = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.modo === 'editor' &&
      (changes['modo'] || changes['trajetoria'] || changes['trajetoriaDuplicada'])
    ) {
      this.inicializarEditor();
    }
  }

  get etapasSelecionadas(): TrajetoriaEtapa[] {
    return this.trajetoria ? this.etapasDaTrajetoria(this.trajetoria) : [];
  }

  get tiposEtapaOpcoes(): OpcaoTipoEtapa[] {
    return this.tiposEtapa
      .filter((tipo) => tipo.st_ativo || this.tipoEstaEmUso(tipo.seq_etapa_trajetoria))
      .map((tipo) => ({
        label: tipo.st_ativo ? tipo.ds_nome : `${tipo.ds_nome} (inativo)`,
        value: tipo.seq_etapa_trajetoria,
        icon: this.iconeTipoEtapa(tipo.seq_etapa_trajetoria),
        color: this.corTagTipoEtapa(tipo.seq_etapa_trajetoria),
        textColor: this.corTextoTagTipoEtapa(tipo.seq_etapa_trajetoria),
      }));
  }

  get filiaisOpcoes(): Opcao<number>[] {
    return this.filiais
      .filter((filial) => filial.st_ativo)
      .map((filial) => ({ label: filial.ds_nome, value: filial.seq_filial }));
  }

  get filiaisPadraoOpcoes(): Opcao<number>[] {
    return this.filiaisOpcoes.filter((filial) => this.filiaisSelecionadas.includes(filial.value));
  }

  get quantidadeObrigatorias(): number {
    return this.etapasSelecionadas.filter((etapa) => etapa.st_obrigatoria).length;
  }

  get prazoSugerido(): number | null {
    const prazos = this.etapasSelecionadas
      .map((etapa) => etapa.nr_prazo_dias)
      .filter((prazo): prazo is number => prazo !== null && prazo !== undefined);
    return prazos.length ? Math.max(...prazos) : null;
  }

  adicionarEtapa(): void {
    this.etapasEditor.forEach((etapa) => (etapa.expandida = false));
    this.etapasEditor.push(this.novaEtapaEditor(true));
  }

  duplicarEtapa(indice: number): void {
    const original = this.etapasEditor[indice];
    const copia: EtapaEditor = {
      ...original,
      chave: this.proximaChave++,
      seq_trajetoria_etapa: undefined,
      ds_nome: `${original.ds_nome} (cópia)`,
      expandida: true,
    };
    this.etapasEditor.forEach((etapa) => (etapa.expandida = false));
    this.etapasEditor.splice(indice + 1, 0, copia);
  }

  removerEtapa(indice: number): void {
    if (this.etapasEditor.length === 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Etapa obrigatória',
        detail: 'A trajetória deve possuir ao menos uma etapa.',
      });
      return;
    }
    this.etapasEditor.splice(indice, 1);
  }

  moverEtapa(indice: number, direcao: -1 | 1): void {
    const destino = indice + direcao;
    if (destino < 0 || destino >= this.etapasEditor.length) {
      return;
    }
    [this.etapasEditor[indice], this.etapasEditor[destino]] = [
      this.etapasEditor[destino],
      this.etapasEditor[indice],
    ];
  }

  aoAlterarFiliais(): void {
    this.filiaisPadrao = this.filiaisPadrao.filter((seqFilial) =>
      this.filiaisSelecionadas.includes(seqFilial),
    );
  }

  salvar(): void {
    if (!this.validarEditor()) {
      return;
    }

    this.salvando = true;
    const nome = this.modoEdicao && this.trajetoria ? this.trajetoria.ds_nome : this.form.ds_nome.trim();
    const versao =
      this.modoEdicao && this.trajetoria
        ? this.trajetoria.nr_versao + 1
        : this.form.nr_versao;
    const payloadBase: TrajetoriaCreate = {
      ds_nome: nome,
      ds_descricao: this.form.ds_descricao.trim() || null,
      nr_versao: versao,
    };

    this.salvarTrajetoria(payloadBase)
      .pipe(
        switchMap((trajetoria) => this.sincronizarEtapas(trajetoria)),
        switchMap((trajetoria) => this.sincronizarFiliais(trajetoria)),
      )
      .subscribe({
        next: (trajetoria) => {
          this.salvando = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Trajetória salva',
            detail: 'O modelo e suas etapas foram salvos com sucesso.',
          });
          this.salvo.emit(trajetoria.seq_trajetoria);
        },
        error: (erro: HttpErrorResponse) => {
          this.salvando = false;
          this.exibirErro('Não foi possível salvar a trajetória.', erro);
        },
      });
  }

  etapasDaTrajetoria(trajetoria: Trajetoria): TrajetoriaEtapa[] {
    return this.etapas
      .filter((etapa) => etapa.seq_trajetoria === trajetoria.seq_trajetoria && etapa.st_ativo)
      .sort((a, b) => a.nr_ordem - b.nr_ordem);
  }

  filiaisDaTrajetoria(trajetoria: Trajetoria): Filial[] {
    const ids = new Set(
      this.relacoesDaTrajetoria(trajetoria, true).map((relacao) => relacao.seq_filial),
    );
    return this.filiais.filter((filial) => ids.has(filial.seq_filial));
  }

  filialEhPadrao(trajetoria: Trajetoria, seqFilial: number): boolean {
    return this.relacoesDaTrajetoria(trajetoria, true).some(
      (relacao) => relacao.seq_filial === seqFilial && relacao.st_padrao,
    );
  }

  nomeTipoEtapa(id: number): string {
    return this.tiposEtapa.find((tipo) => tipo.seq_etapa_trajetoria === id)?.ds_nome ?? 'Outra';
  }

  corTagTipoEtapa(id: number): string {
    const cor = this.tiposEtapa
      .find((tipo) => tipo.seq_etapa_trajetoria === id)
      ?.color_tag.trim()
      .toLocaleLowerCase('en-US');
    return cor && /^[a-z]+$/.test(cor) ? cor : 'slategray';
  }

  corTextoTagTipoEtapa(id: number): string {
    const coresClaras = new Set([
      'aqua', 'beige', 'cyan', 'gold', 'ivory', 'khaki', 'lavender', 'lightblue',
      'lightgreen', 'lightyellow', 'lime', 'orange', 'pink', 'silver', 'white', 'yellow',
    ]);
    return coresClaras.has(this.corTagTipoEtapa(id)) ? '#1f2937' : '#ffffff';
  }

  iconeTipoEtapa(id: number | null): string {
    const primeIcon = id
      ? this.tiposEtapa.find((tipo) => tipo.seq_etapa_trajetoria === id)?.prime_icon.trim()
      : null;
    const icon = primeIcon && /^pi-[a-z0-9-]+$/.test(primeIcon) ? primeIcon : 'pi-list-check';
    return `pi ${icon}`;
  }

  resumoEtapa(etapa: EtapaEditor): string {
    const tipo = etapa.seq_etapa_trajetoria
      ? this.nomeTipoEtapa(etapa.seq_etapa_trajetoria)
      : 'Tipo não definido';
    const prazo = etapa.nr_prazo_dias !== null ? `Até ${etapa.nr_prazo_dias} dias` : 'Sem prazo';
    return `${tipo} • ${prazo} • ${etapa.st_obrigatoria ? 'Obrigatória' : 'Opcional'}`;
  }

  private inicializarEditor(): void {
    const origem = this.trajetoria ?? this.trajetoriaDuplicada;
    this.modoEdicao = Boolean(this.trajetoria);

    if (!origem) {
      this.form = this.novoForm();
      this.idsEtapasOriginais = [];
      this.filiaisSelecionadas = [];
      this.filiaisPadrao = [];
      this.etapasEditor = [this.novaEtapaEditor(true)];
      return;
    }

    const etapas = this.etapasDaTrajetoria(origem);
    const relacoes = this.relacoesDaTrajetoria(origem, true);
    this.form = {
      ds_nome: this.trajetoriaDuplicada ? `${origem.ds_nome} (cópia)` : origem.ds_nome,
      ds_descricao: origem.ds_descricao ?? '',
      nr_versao: this.trajetoriaDuplicada ? 1 : origem.nr_versao,
      st_ativo: this.trajetoriaDuplicada ? true : origem.st_ativo,
    };
    this.idsEtapasOriginais = this.modoEdicao
      ? etapas.map((etapa) => etapa.seq_trajetoria_etapa)
      : [];
    this.filiaisSelecionadas = relacoes.map((relacao) => relacao.seq_filial);
    this.filiaisPadrao = this.modoEdicao
      ? relacoes.filter((relacao) => relacao.st_padrao).map((relacao) => relacao.seq_filial)
      : [];
    this.etapasEditor = etapas.length
      ? etapas.map((etapa, index) => ({
          ...this.converterEtapaParaEditor(etapa, index === 0),
          seq_trajetoria_etapa: this.modoEdicao ? etapa.seq_trajetoria_etapa : undefined,
        }))
      : [this.novaEtapaEditor(true)];
  }

  private salvarTrajetoria(payload: TrajetoriaCreate): Observable<Trajetoria> {
    if (this.modoEdicao && this.trajetoria) {
      const atualizacao: TrajetoriaUpdate = { ...payload, st_ativo: this.form.st_ativo };
      return this.trajetoriaService.atualizar(this.trajetoria.seq_trajetoria, atualizacao);
    }

    return this.trajetoriaService.criar(payload).pipe(
      switchMap((trajetoria) =>
        this.form.st_ativo
          ? of(trajetoria)
          : this.trajetoriaService.atualizar(trajetoria.seq_trajetoria, {
              ...payload,
              st_ativo: false,
            }),
      ),
    );
  }

  private sincronizarEtapas(trajetoria: Trajetoria): Observable<Trajetoria> {
    const idsMantidos = new Set(
      this.etapasEditor
        .map((etapa) => etapa.seq_trajetoria_etapa)
        .filter((id): id is number => id !== undefined),
    );
    const inativacoes = this.idsEtapasOriginais
      .filter((id) => !idsMantidos.has(id))
      .map((id) => this.trajetoriaEtapaService.inativar(id));

    return this.executarEmLote(inativacoes).pipe(
      switchMap(() => this.liberarOrdensTemporariamente(trajetoria.seq_trajetoria)),
      switchMap(() => {
        const operacoes = this.etapasEditor.map((etapa, indice) => {
          const payload = this.montarPayloadEtapa(etapa, trajetoria.seq_trajetoria, indice + 1);
          return etapa.seq_trajetoria_etapa
            ? this.trajetoriaEtapaService.atualizar(etapa.seq_trajetoria_etapa, {
                ...payload,
                st_ativo: true,
              })
            : this.trajetoriaEtapaService.criar(payload);
        });
        return this.executarEmLote(operacoes).pipe(map(() => trajetoria));
      }),
    );
  }

  private sincronizarFiliais(trajetoria: Trajetoria): Observable<Trajetoria> {
    const relacoesExistentes = this.relacoesDaTrajetoria(trajetoria);
    const idsSelecionados = new Set(this.filiaisSelecionadas);
    const inativacoes = relacoesExistentes
      .filter((relacao) => relacao.st_ativo && !idsSelecionados.has(relacao.seq_filial))
      .map((relacao) =>
        this.filialTrajetoriaService.inativar(relacao.seq_filial, trajetoria.seq_trajetoria),
      );
    const idsFiliaisPadrao = new Set(this.filiaisPadrao);
    const remocoesDePadrao = this.filiaisTrajetorias
      .filter(
        (relacao) =>
          idsFiliaisPadrao.has(relacao.seq_filial) &&
          relacao.seq_trajetoria !== trajetoria.seq_trajetoria &&
          relacao.st_padrao &&
          relacao.st_ativo,
      )
      .map((relacao) =>
        this.filialTrajetoriaService.atualizar(relacao.seq_filial, relacao.seq_trajetoria, {
          st_padrao: false,
          st_ativo: true,
        }),
      );

    return this.executarEmLote(inativacoes).pipe(
      switchMap(() => this.executarEmLote(remocoesDePadrao)),
      switchMap(() => {
        const operacoes = this.filiaisSelecionadas.map((seqFilial) => {
          const existente = relacoesExistentes.find((relacao) => relacao.seq_filial === seqFilial);
          const dados = { st_padrao: idsFiliaisPadrao.has(seqFilial), st_ativo: true };
          return existente
            ? this.filialTrajetoriaService.atualizar(
                seqFilial,
                trajetoria.seq_trajetoria,
                dados,
              )
            : this.filialTrajetoriaService.criar({
                seq_filial: seqFilial,
                seq_trajetoria: trajetoria.seq_trajetoria,
                st_padrao: dados.st_padrao,
              });
        });
        return this.executarEmLote(operacoes).pipe(map(() => trajetoria));
      }),
    );
  }

  private liberarOrdensTemporariamente(seqTrajetoria: number): Observable<TrajetoriaEtapa[]> {
    const atualizacoes = this.etapasEditor
      .filter((etapa): etapa is EtapaEditor & { seq_trajetoria_etapa: number } =>
        Boolean(etapa.seq_trajetoria_etapa),
      )
      .map((etapa, indice) =>
        this.trajetoriaEtapaService.atualizar(
          etapa.seq_trajetoria_etapa,
          {
            ...this.montarPayloadEtapa(etapa, seqTrajetoria, 1_000_000 + indice),
            st_ativo: true,
          },
        ),
      );
    return this.executarEmLote(atualizacoes);
  }

  private montarPayloadEtapa(
    etapa: EtapaEditor,
    seqTrajetoria: number,
    ordem: number,
  ): TrajetoriaEtapaCreate {
    return {
      seq_trajetoria: seqTrajetoria,
      seq_etapa_trajetoria: etapa.seq_etapa_trajetoria as number,
      ds_nome: etapa.ds_nome.trim(),
      ds_descricao: etapa.ds_descricao.trim() || null,
      nr_ordem: ordem,
      nr_prazo_dias: etapa.nr_prazo_dias,
      st_obrigatoria: etapa.st_obrigatoria,
      st_permite_pular: etapa.st_permite_pular,
      st_exige_observacao: etapa.st_exige_observacao,
    };
  }

  private executarEmLote<T>(operacoes: Observable<T>[]): Observable<T[]> {
    return operacoes.length ? forkJoin(operacoes) : of([]);
  }

  private validarEditor(): boolean {
    if (!this.form.ds_nome.trim()) {
      return this.exibirValidacao('Informe o nome da trajetória.');
    }
    if (!Number.isInteger(this.form.nr_versao) || this.form.nr_versao <= 0) {
      return this.exibirValidacao('A versão deve ser um número inteiro maior que zero.');
    }
    if (!this.etapasEditor.length) {
      return this.exibirValidacao('Adicione ao menos uma etapa.');
    }
    const etapaInvalida = this.etapasEditor.find(
      (etapa) =>
        !etapa.ds_nome.trim() ||
        !etapa.seq_etapa_trajetoria ||
        (etapa.nr_prazo_dias !== null && etapa.nr_prazo_dias < 0),
    );
    if (etapaInvalida) {
      etapaInvalida.expandida = true;
      return this.exibirValidacao(
        'Preencha o nome, o tipo e um prazo válido em todas as etapas.',
      );
    }
    return true;
  }

  private exibirValidacao(detalhe: string): false {
    this.messageService.add({ severity: 'warn', summary: 'Revise os dados', detail: detalhe });
    return false;
  }

  private exibirErro(mensagem: string, erro: HttpErrorResponse): void {
    const detalhe =
      typeof erro.error?.detail === 'string' ? erro.error.detail : 'Tente novamente em instantes.';
    this.messageService.add({ severity: 'error', summary: mensagem, detail: detalhe });
  }

  private tipoEstaEmUso(id: number): boolean {
    return this.etapasEditor.some((etapa) => etapa.seq_etapa_trajetoria === id);
  }

  private relacoesDaTrajetoria(
    trajetoria: Trajetoria,
    somenteAtivas = false,
  ): FilialTrajetoria[] {
    return this.filiaisTrajetorias.filter(
      (relacao) =>
        relacao.seq_trajetoria === trajetoria.seq_trajetoria &&
        (!somenteAtivas || relacao.st_ativo),
    );
  }

  private novoForm(): TrajetoriaForm {
    return { ds_nome: '', ds_descricao: '', nr_versao: 1, st_ativo: true };
  }

  private novaEtapaEditor(expandida: boolean): EtapaEditor {
    return {
      chave: this.proximaChave++,
      seq_etapa_trajetoria: null,
      ds_nome: '',
      ds_descricao: '',
      nr_prazo_dias: null,
      st_obrigatoria: false,
      st_permite_pular: true,
      st_exige_observacao: false,
      expandida,
    };
  }

  private converterEtapaParaEditor(etapa: TrajetoriaEtapa, expandida: boolean): EtapaEditor {
    return {
      chave: this.proximaChave++,
      seq_trajetoria_etapa: etapa.seq_trajetoria_etapa,
      seq_etapa_trajetoria: etapa.seq_etapa_trajetoria,
      ds_nome: etapa.ds_nome,
      ds_descricao: etapa.ds_descricao ?? '',
      nr_prazo_dias: etapa.nr_prazo_dias ?? null,
      st_obrigatoria: etapa.st_obrigatoria,
      st_permite_pular: etapa.st_permite_pular,
      st_exige_observacao: etapa.st_exige_observacao,
      expandida,
    };
  }
}
