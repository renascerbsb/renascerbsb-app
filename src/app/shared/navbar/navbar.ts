import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  isLight = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      this.setLightTheme();
      this.isLight = true;
    }
  }

  toggleTheme() {
    this.isLight = !this.isLight;

    if (this.isLight) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  setLightTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }

  setDarkTheme() {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  }
}