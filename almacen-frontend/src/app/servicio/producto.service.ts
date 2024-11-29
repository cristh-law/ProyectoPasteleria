import { Injectable } from '@angular/core';
import {GenericService} from "./generic.service";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Producto} from "../modelo/Producto";

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto>{

  protected krubject = new
  BehaviorSubject<Producto[]>([]);
  private messageChange: Subject<string> = new
  Subject<string>;
  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/productos`);
  }
  setProductoChange(data: Producto[]){
    this.krubject.next(data);
  }
  getProductoChange(){
    return this.krubject.asObservable();
  }
  setMessageChange(data: string){
    this.messageChange.next(data);
  }
  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
