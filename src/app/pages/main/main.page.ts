import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {title: 'Inicio', url: '/main/home', icon: 'home-outline'},
    {title: 'Perfil', url: '/main/profile', icon: 'person-outline'}
  ]

    router = inject(Router);
    currentPath: string='';
    firebaseSvs = inject(FirebaseService);
    utilsSvs  = inject(UtilsService);



  ngOnInit() {
    this.router.events.subscribe((event: any)=>{
          if (event?.url) this.currentPath = event.url;
    })
  }

  user() : User{
    return this.utilsSvs.getFromLocalStorage('user');
  }

  //cerrar sesion


  signOut(){
    this.firebaseSvs.signOut();
  }

}
