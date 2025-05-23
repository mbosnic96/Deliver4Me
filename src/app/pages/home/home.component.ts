import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 steps = [
    {
      icon: 'box',
      title: 'Objavi šta trebaš prevesti',
      description: 'Unesi detalje o pošiljci, lokaciju i kada je treba prevesti.'
    },
    {
      icon: 'handshake',
      title: 'Primaj ponude',
      description: 'Vozači ti nude cijenu i vrijeme, ti biraš najbolju opciju.'
    },
    {
      icon: 'route',
      title: 'Prati dostavu',
      description: 'Gledaj u stvarnom vremenu gdje se tvoja pošiljka nalazi.'
    },
    {
      icon: 'star-half-alt',
      title: 'Ocijeni iskustvo',
      description: 'Daj ocjenu vozaču i pomozi drugima da izaberu pametno.'
    }
  ];

  benefits = [
    {
      icon: 'shield-alt',
      title: 'Sigurna platforma',
      description: 'Verifikovani vozači i praćenje uživo pošiljke.'
    },
    {
      icon: 'tags',
      title: 'Povoljne cijene',
      description: 'Freelance tržište garantuje konkurentne ponude.'
    },
    {
      icon: 'route',
      title: 'Fleksibilnost',
      description: 'Voziš kad želiš, šalješ kad tebi odgovara.'
    },
    {
      icon: 'headset',
      title: '24/7 Podrška',
      description: 'Naš tim ti stoji na raspolaganju svaki dan.'
    }
  ];

testimonials = [
  {
    quote: 'Koristim Deliver4Me već godinu dana i nikad nisam imao problema. Brzo i profesionalno!',
    name: 'Marko Petrović',
    role: 'Preduzetnik',
    photo: '/user.png'
  },
  {
    quote: 'Vozač je stigao tačno na vrijeme i sve je prošlo bez problema. Preporučujem svima!',
    name: 'Ivana Kovačević',
    role: 'Privatna korisnica',
    photo: '/user.png'
  },
  {
    quote: 'Kao vozač, ova platforma mi omogućava fleksibilan raspored i redovne isplate.',
    name: 'Nemanja Ilić',
    role: 'Freelance vozač',
    photo: '/user.png'
  },
  {
    quote: 'Dostava iz drugog grada za manje od 24 sata – nisam mogao vjerovati koliko je bilo jednostavno.',
    name: 'Amar Delić',
    role: 'Online prodavac',
    photo: '/user.png'
  },
  {
    quote: 'Korisnička podrška je reagovala brzo kada sam imao pitanje. Sve pohvale za tim!',
    name: 'Lejla Hadžić',
    role: 'Korisnica aplikacije',
    photo: '/user.png'
  }
];

}

