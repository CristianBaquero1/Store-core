import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

firebaseSvs = inject(FirebaseService);
utilsSvs  = inject(UtilsService);


products: Product[]  =  [];
loading: boolean=false;

  ngOnInit() {
  }
  // obtener productos
  user() : User{
    return this.utilsSvs.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    this.getProducts();  
  }
  getProducts(){
   let path = `users/${this.user().uid}/products`;

   this.loading =true;
   
   let sub = this.firebaseSvs.getCollectionData(path).subscribe({
      next: (res : any) => {
        console.log(res);
        this.products = res;

        this.loading =false;
        sub.unsubscribe();
        
      }
    });
  }


  doRefresh(event) {
    setTimeout(() => {
      this.getProducts(); 
      event.target.complete();
    }, 1000);
  }

  //ganancias totales
  getProfits(){
    return this.products.reduce((index,product)=>index + product.price * product.soldUnits, 0)
  }


   //======= Agregar o actulizar producto=======

  async addUpdateProduct(product?: Product){

    let success = await   this.utilsSvs.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps:{product}
    })
    if (success)this.getProducts();

   }

      async confirmDeleteProduct(product : Product) {
        this.utilsSvs.presentAlert({
          header: 'Eliminar Producto',
          message: '¿Estas seguro de eliminar el producto?',
          mode:'ios',
          buttons: [
            {
              text: 'Cancelar',
              
            }, {
              text: 'si, eliminar',
              handler: () => {
                this.deleteProduct(product)
              }
            }
          ]
        });
      
        
      }

   //Eliminar Producto
  async deleteProduct(product : Product){

    let path = `users/${this.user().uid}/products/${product.id}`
    const loading = await this.utilsSvs.loading();
    await loading.present ();
    //====subir imagen
      
    let imagePath = await this.firebaseSvs.getFilePath(product.image);
    await this.firebaseSvs.deleteFile(imagePath);
  
  
     this.firebaseSvs.deleteDocument(path).then  ( async res =>{
     this.products = this.products.filter(p => p.id !==product.id); 
      
      this.utilsSvs.presentToast({
        message: 'Producto Eliminado exitosamente',
        duration:1500,
        color: 'success',
        position:'middle',
        icon:'checkmark-circule-outline'
      })
  
      
     
      
     }).catch(error =>{
      console.log(error);
      this.utilsSvs.presentToast({
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
