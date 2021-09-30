import { ContatoService } from './../contato.service';
import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component'
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario!: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto','id', 'nome', 'email', 'favorito'];
  totalElementos = 0;
  pagina = 0;
  tamanho = 10;
  pageSizeOptions : number[] = [10];


  constructor(private contatoService: ContatoService, private fb: FormBuilder, private dialog : MatDialog, private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos(this.pagina, this.tamanho);
  }

  montarFormulario() {

    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    })
  }

  listarContatos(pagina = 0, tamanho = 10) {
    this.contatoService.list(pagina, tamanho).subscribe(response => {
      this.contatos = response.content;
      this.totalElementos = response.totalElements;
      this.pagina = response.number;
    })
  }

  favoritar(contato : Contato) {

    this.contatoService.favorite(contato).subscribe( response => {
      contato.favorito = !contato.favorito;

    })
  }


  uploadFoto(event : any, contato : Contato){
    const files = event.target.files;
    if(files){
      const foto = files[0];
      const formData : FormData = new FormData();
      formData.append("foto", foto);
      this.contatoService.upload(contato, formData).subscribe( response => this.listarContatos());
    }
  }

  onSubmit() {

    const formValues = this.formulario.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.contatoService.salvar(contato).subscribe(response => {
      this.listarContatos();
      this.snackBar.open('Contato foi adicionado!!', 'Sucesso', {duration : 2000})
    })
    this.formulario.reset();
  }

  visualizarContato(contato : Contato){
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    });
  }

  paginar(event : PageEvent){
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina, this.tamanho);
  }


}
