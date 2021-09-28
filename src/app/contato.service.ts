import { Contato } from './contato/contato';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  

  constructor(private http : HttpClient) { }


  url : string = environment.apiBaseUrl;

  salvar(contato : Contato) : Observable<Contato>{ 

    return this.http.post<Contato>(this.url, contato);
  }

  list() : Observable<Contato[]>{
    return this.http.get<any>(this.url);
  }

  favorite(contato : Contato) : Observable<any>{
    return this.http.patch(`${this.url}/${contato.id}/favorito`, null);
  }
}
