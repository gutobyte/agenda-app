import { ContatoService } from './../contato.service';
import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario!: FormGroup;
  contatos: Contato[] = [];
  colunas = ['id', 'nome', 'email', 'favorito'];


  constructor(private contatoService: ContatoService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos();
  }

  montarFormulario() {

    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    })
  }

  listarContatos() {
    this.contatoService.list().subscribe(response => {
      this.contatos = response;
    })
  }

  favoritar(contato : Contato) {

    this.contatoService.favorite(contato).subscribe( response => {
      contato.favorito = !contato.favorito;

    })
  }

  onSubmit() {

    const formValues = this.formulario.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.contatoService.salvar(contato).subscribe(response => {
      let lista : Contato[] = [...this.contatos, response];
      console.log(this.contatos);
      this.contatos = lista;
    })

  }


}
