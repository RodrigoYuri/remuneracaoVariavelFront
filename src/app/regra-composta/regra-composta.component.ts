import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { RegraDTO } from '../../models/Regra.dto'
import { Bloco } from 'src/models/Bloco.dto';
import { ToastrService } from 'ngx-toastr';
import { IndicadorService } from 'src/services/domain/indicador.service';
import { RegraService } from 'src/services/domain/regra.service';
import { IndicadorDTO } from 'src/models/Indicador.dto';
import { CadastroSegmentoService } from 'src/services/domain/cadastroSegmento.service';
import { SegmentosDTO } from 'src/models/Segmentos.dto';
import { TipoRemuneracaoDTO } from 'src/models/TipoRemuneracao.dto';
import { TipoRemuneracaoService } from 'src/services/domain/tipoRemuneracao.service';
import { PeriodoService } from 'src/services/domain/periodo.service';


@Component({
  selector: 'rv-regra-composta',
  templateUrl: './regra-composta.component.html',
  styleUrls: ['./regra-composta.component.css']
})
export class RegraCompostaComponent implements OnInit {

  lsIndicadores: IndicadorDTO [] = [
    {id: 1, nmIndicador: "Indicador 1"},
    {id: 2, nmIndicador: "Indicador 2"},
    {id: 3, nmIndicador: "Indicador 3"}
  ]
  result: Boolean;
  linhas: RegraDTO[] = [];
  valorTaxa: Number;
  indicadorTaxa: String;
  agravoTaxa: String;
  blocos: Bloco[] = [];
  isOpenAcordeon: Boolean
  isClosedAcordeon: Boolean
  idBloco: number
  flagExcluir = false
  excluirId: number
  proporcional: boolean
  segmentos: SegmentosDTO[] = [];
  segmentoSelected : any
 
  lsTipoRemuneracao : TipoRemuneracaoDTO[] = [];
  tipoRemuneracaoSelected: any


  imprimeEscolha(){
    console.log(this.segmentoSelected)
  }

  imprimeEvento(valor: any){
   console.log("VALOR DO EVENTO EMITIDO::::::::::::", valor)
   this.result = valor;
 }

  linha: RegraDTO = {
    id: null,
    indicadorRegra: "",
    agravo: "",
    valorMinimo: null,
    valorMaximo:null,
    periodo: null,
    pesoRegra: null,
    referencia: null,

  }



  blocoAtual: Number;

  constructor(private toast: ToastrService,
              private indicadorService: IndicadorService,
              private regraService: RegraService,
              private segmentosService: CadastroSegmentoService,
              private tipoRemuneracaoService: TipoRemuneracaoService,
             ) { }

  ngOnInit() {

    this.regraService.getAll().subscribe(x=>{
      console.log("GET - LISTA REGRA", x)
      this.blocos = x;
    })

    this.segmentosService.getSegmentos().subscribe(segmentos=>{
      console.log("GET - LISTA SEGMENTOS", segmentos);
      this.segmentos = segmentos
    })

    this.tipoRemuneracaoService.getAll().subscribe(lsTipoRemuneracao=>{
      console.log("GET - TIPO REMUNERACAO", lsTipoRemuneracao)
      this.lsTipoRemuneracao = lsTipoRemuneracao
    })

    this.linhas.push(this.linha)
    this.result = false;
    this.isOpenAcordeon = true;
    this.isClosedAcordeon = false;
    

    console.log("lista de indicadores", this.lsIndicadores)
  }

  anularIndicador(){
    if(this.agravoTaxa === "%"){
      this.indicadorTaxa = null
    }else{
      this.indicadorTaxa = "Sem Indicador"
    }
  }
  adicionarLinha() {
    this.result = false
    console.log(this.result)
    const newLine = {
        id: null,
        indicadorRegra: "",
        agravo: "",
        valorMinimo: "",
        valorMaximo:"",
        periodo: null,
        pesoRegra: null,
        referencia: null
    }
    this.linhas.push(newLine)

  }

  removerLinha() {
    this.linhas.pop()
    if(this.linhas.length > 0){
      this.result = true
    }else{
      this.result = false
    }
    
  }
 
  /**
   * Método responsável por adicionar ao bloco todas as linhas de regras cadastradas
   */
  incluirTaxa() {
    const bloco: Bloco ={
      id: null,
      lsRegra: null,
      valorTaxa: null,
      indicadorTaxa: "",
      agravoTaxa: "",
      blocoObrigatorio: false,
      indcProporcionalidade:false,
      lsSegmento: null,
      lsTipoRemuneracao: null
    }
    console.log("MODO EDIÇÃO", this.isOpenAcordeon)
    if(!this.isOpenAcordeon){

        this.blocos[this.idBloco].agravoTaxa = this.agravoTaxa,
        this.blocos[this.idBloco].indicadorTaxa = this.indicadorTaxa,
        this.blocos[this.idBloco].lsRegra = this.linhas
        this.blocos[this.idBloco].blocoObrigatorio = false,
        this.blocos[this.idBloco].indcProporcionalidade = false
        this.blocos[this.idBloco].valorTaxa = this.valorTaxa
        this.blocos[this.idBloco].lsSegmento = this.segmentos,
        this.blocos[this.idBloco].lsTipoRemuneracao = this.lsTipoRemuneracao
        this.regraService.update(this.blocos[this.idBloco])

        console.log("BLOCO NO CONTEXTO ATUALIZACAO:", this.blocos[this.idBloco])
        this.toast.success("As regras foram atualizadas com sucesso")
        setTimeout(() => {
          location.reload()
      }, 2000);



    }else{
      console.log("LINHAS COM OS VALORES:::::::::::::::::::::::::", this.linhas)
      bloco.lsRegra = this.linhas;
      bloco.indicadorTaxa = this.indicadorTaxa;
      bloco.valorTaxa= this.valorTaxa;
      bloco.lsTipoRemuneracao = this.lsTipoRemuneracao;
      bloco.agravoTaxa = this.agravoTaxa;
      bloco.lsSegmento = this.segmentos,
      bloco.indcProporcionalidade = this.proporcional,
    
      console.log("BLOCO NO CONTEXTO INCLUSAO:", bloco)
      this.blocos.push(bloco)
   
      //this.regraService.insert(bloco)

      

    }

    this.linhas = []
      this.indicadorTaxa = ""
      this.valorTaxa = null,
      this.agravoTaxa = ""
      this.isOpenAcordeon = false;

  }


  carregarCampos(bloco:Bloco, idBloco: number){
    console.log("BLOCO PRA EDICAO", bloco)
    this.isOpenAcordeon = false
    this.isClosedAcordeon = true
    this.linhas = bloco.lsRegra
    console.log("BLOCO DE EDIÇÃO LSREGRA", bloco.lsRegra)
    this.indicadorTaxa = bloco.indicadorTaxa
    this.agravoTaxa = bloco.agravoTaxa
    this.indicadorTaxa = bloco.indicadorTaxa
    this.valorTaxa = bloco.valorTaxa
    this.idBloco = idBloco
    this.result = true
  }



  limparCampos(){
    this.indicadorTaxa = ""
    this.valorTaxa = null
    this.agravoTaxa = ""
    this.linhas = []
    this.isOpenAcordeon = true;
    this.isClosedAcordeon = false;
    location.reload();
  }

  deletarItem(item: RegraDTO){
    this.linhas = this.linhas.filter(linha=>{
      return linha != item
    })

    if(this.linhas.length > 0){
      this.result = true
    }else{
      this.result = false
    }

   
      
    
    
  }


  excluirBloco(bloco: Bloco){
    this.regraService.delete(bloco.id)
  }

  setExcluir(id:number){
    this.flagExcluir = true
    this.excluirId = id
  }
}



