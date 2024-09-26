import { Component, inject, Input, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  @Input() product : Product

  form = new FormGroup({
    id:new FormControl('',),
    image: new FormControl('',[Validators.required,]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
    price: new FormControl(null,[Validators.required,Validators.min(0)]),
    soldUnits: new FormControl(null,[Validators.required,Validators.min(0)])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  //====== tomar Foto====

   async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('imagen del producto')).dataUrl
    this.form.controls.image.setValue(dataUrl);

    }


    submit (){
      if (this.product)this.UpdateProduct();
      else this.createProduct()

    }

    
//crear Producto

 async createProduct(){

  let path = `users/${this.user.uid}/products`
  const loading = await this.utilsSvc.loading();
  await loading.present ();
  //====subir imagen
  let dataUrl = this.form.value.image;
  let imagePath = `${this.user.uid}/${Date.now()}`;
  let imgeUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
  this.form.controls.image.setValue(imgeUrl);


  delete this.form.value.id



   this.firebaseSvc.addDocument(path,this.form.value).then  ( async res =>{
   
    this.utilsSvc.dismissModal({sucess : true});
    this.utilsSvc.presentToast({
      message: 'Producto creado exitosamente',
      duration:1500,
      color: 'success',
      position:'middle',
      icon:'checkmark-circule-outline'
    })

    
   
    
   }).catch(error =>{
    console.log(error);
    this.utilsSvc.presentToast({
      message: error.message,
      duration:2500,
      color: 'warning',
      position:'middle',
      icon:'alert-circule-outline'
    })
    
   }).finally(()=>{
    loading.dismiss();
   })

  }





//actualizar Producto
  async UpdateProduct(){

    let path = `users/${this.user.uid}/products/${this.product.id}`
    const loading = await this.utilsSvc.loading();
    await loading.present ();
    //====subir imagen
      
    if (this.form.value.image!== this.product.image){
        
    let dataUrl = this.form.value.image;
    let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
    let imgeUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imgeUrl);

    } 

  
  
    delete this.form.value.id
  
  
  
     this.firebaseSvc.updateDocument(path,this.form.value).then  ( async res =>{
     
      this.utilsSvc.dismissModal({sucess : true});
      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente',
        duration:1500,
        color: 'success',
        position:'middle',
        icon:'checkmark-circule-outline'
      })
  
      
     
      
     }).catch(error =>{
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration:2500,
        color: 'warning',
        position:'middle',
        icon:'alert-circule-outline'
      })
      
     }).finally(()=>{
      loading.dismiss();
     })
  
    }





    
}
