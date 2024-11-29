import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MaterialModule} from "../../../material/material.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {switchMap} from "rxjs";
import {Producto} from "../../../modelo/Producto";
import {ProductoService} from "../../../servicio/producto.service";

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [MaterialModule, FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
})
export class FormProductoComponent implements OnInit {
  @ViewChild('ProductoForm') productoForm!: NgForm ;
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Producto,
    private krService: ProductoService,
    private _dialogRef: MatDialogRef<FormProductoComponent>
  ){}
  ngOnInit(): void {
    if(this.data!==undefined){
      console.log(this.data['nombre']);
      console.log(this.data['descripcion']);
      console.log(this.data['precioventa']);
      console.log(this.data['categoria']);

      this.form = new FormGroup({
        idProducto: new FormControl(this.data['idProducto']),
        nombre: new FormControl(this.data['nombre'], [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        descripcion: new FormControl(this.data['descripcion'], [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        precioventa: new FormControl(this.data['precioventa'], [Validators.required]),
        categoria: new FormControl(this.data['categoria'], [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
      });
    }else{
      this.form = new FormGroup({
        idProducto: new FormControl(0),
        nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
        precioventa: new FormControl('', [Validators.required]),
        categoria: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)])
      });
    }
  }
  close(){
    this._dialogRef.close();
  }
  operate(){
    const kr: Producto = new Producto();
    kr.idProducto = this.form.value['idProducto'];
    kr.nombre = this.form.value['nombre'];
    kr.descripcion = this.form.value['descripcion'];
    kr.precioventa = this.form.value['precioventa'];
    kr.categoria = this.form.value['categoria'];

    if(this.productoForm.valid){
      if(kr.idProducto > 0){
        //UPDATE
        this.krService.update(kr.idProducto, kr)
          .pipe(switchMap( ()=> this.krService.findAll() ))
          .subscribe(data => {
            this.krService.setProductoChange(data);
            this.krService.setMessageChange('UPDATED!');
            this.close();
          });
      }else{
        //INSERT
        this.krService.save(kr)
          .pipe(switchMap( ()=> this.krService.findAll() ))
          .subscribe(data => {
            this.krService.setProductoChange(data);
            this.krService.setMessageChange('CREATED!');
            this.close();
          });
      }
    }else{
      console.log("Error....")
    }
  }
  get f(){
    return this.form.controls;
  }
}
