import { Injectable } from '@angular/core';
import {GenericService} from "./generic.service";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Categoria} from "../modelo/Categoria";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends GenericService<Categoria>{

  protected krubject = new
  BehaviorSubject<Categoria[]>([]);
  private messageChange: Subject<string> = new
  Subject<string>;
  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/categorias`);
  }
  setCategoriaChange(data: Categoria[]){
    this.krubject.next(data);
  }
  getCategoriaChange(){
    return this.krubject.asObservable();
  }
  setMessageChange(data: string){
    this.messageChange.next(data);
  }
  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
