import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MaterialModule} from "../../../material/material.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {switchMap} from "rxjs";
import {Categoria} from "../../../modelo/Categoria";
import {CategoriaService} from "../../../servicio/categoria.service";


@Component({
  selector: 'app-form-categoria',
  standalone: true,
  imports: [MaterialModule, FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './form-categoria.component.html',
  styleUrl: './form-categoria.component.css'
})
export class FormCategoriaComponent implements OnInit {
  @ViewChild('CategoriaForm') categoriaForm!: NgForm ;
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Categoria,
    private krService: CategoriaService,
    private _dialogRef: MatDialogRef<FormCategoriaComponent>
  ){}
  ngOnInit(): void {
    if(this.data!==undefined){
      console.log(this.data['nombreCategoria']);

      this.form = new FormGroup({
        idCategoria: new FormControl(this.data['idCategoria']),
        nombreCategoria: new FormControl(this.data['nombreCategoria'], [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
      });
    }else{
      this.form = new FormGroup({
        idCategoria: new FormControl(0),
        nombreCategoria: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)])
      });
    }
  }
  close(){
    this._dialogRef.close();
  }
  operate(){
    const kr: Categoria = new Categoria();
    kr.idCategoria = this.form.value['idCategoria'];
    kr.nombreCategoria = this.form.value['nombreCategoria'];

    if(this.categoriaForm.valid){
      if(kr.idCategoria > 0){
        //UPDATE
        this.krService.update(kr.idCategoria, kr)
          .pipe(switchMap( ()=> this.krService.findAll() ))
          .subscribe(data => {
            this.krService.setCategoriaChange(data);
            this.krService.setMessageChange('UPDATED!');
            this.close();
          });
      }else{
        //INSERT
        this.krService.save(kr)
          .pipe(switchMap( ()=> this.krService.findAll() ))
          .subscribe(data => {
            this.krService.setCategoriaChange(data);
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
