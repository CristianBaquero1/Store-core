import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile}from 'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore} from  '@angular/fire/compat/firestore';
import {getFirestore, setDoc , doc,getDoc,addDoc,collection,collectionData,query,updateDoc,deleteDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from  '@angular/fire/compat/storage';
import {getStorage,uploadString,ref,getDownloadURL,deleteObject} from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth =inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvs = inject(UtilsService);

  //=================== Autenticación =======================
     
  
                       //====acceder=======

  signIn(user:User){
     return signInWithEmailAndPassword (getAuth(),user.email,user.password);
  }

                      //====Crear Usuario=======
  signUp(user:User){
    return createUserWithEmailAndPassword (getAuth(),user.email,user.password);
 }
  
                    //====actualizar Usuario=======

  UpdateUser(displayName: string){
return updateProfile(getAuth().currentUser,{displayName});
  }


  //===========================Base de Datos=================


//============== obtener imagenes
getCollectionData(path : string,collectionQuery?:any){
const ref = collection(getFirestore(), path) 
return  collectionData(query(ref, collectionQuery),{idField : 'id'});
}



  //===== CrearDocumento

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path),data);
  }


 //=========== actualizar Producto
  updateDocument(path: string, data: any){
    return updateDoc(doc(getFirestore(), path),data);
  }

    //=========== Eliminar Producto
  deleteDocument(path: string){
    return deleteDoc(doc(getFirestore(), path));
  }

    
  
  //obtener un documento
  
 async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }



  //cerrar sesion
  signOut(){
getAuth().signOut();
localStorage.removeItem('user');
this.utilsSvs.routerLink('/auth');
  }

  //=====agregar docuemento====
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path),data);
  }
// almacenamiento
async uploadImage(path: string, data_url:string){
return uploadString(ref(getStorage(),path),data_url,'data_url').then(()=>{
  return getDownloadURL(ref(getStorage(),path))
});
}

//obtener ruta de la imagen 

async getFilePath(url : string){
  return ref(getStorage(),url).fullPath
}

//Eliminar archivos
deleteFile(path : string){
return deleteObject(ref(getStorage(),path));
}

}
