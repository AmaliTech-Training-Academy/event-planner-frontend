import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-page',
  imports: [RouterModule],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {

  protected readonly missions: {
    title: string,
    description: string;
    icon: string;
  }[] = [
      {
        title: 'Innovation',
        description: 'Constantly pushing boundaries to create cutting-edge event experiences.',
        icon: "icons/bulb.svg"
      },
      {
        title: 'Collaboration',
        description: 'Fostering meaningful connections between people across the globe.',
        icon: "icons/social.svg"
      },
      {
        title: 'Reliability',
        description: 'Delivering consistent, high-quality experiences you can count on.',
        icon: "icons/drop.svg"
      },
      {
        title: 'Growth',
        description: 'Empowering continuous learning and development for all users.',
        icon: "icons/trend_down.svg"
      }
    ]
  protected readonly teamMembers: {
    name: string;
    role: string;
    image: string;
    description: string;
  }[] = [
      {
        name: 'Johnson Sam',
        role: 'CEO & Founder',
        image: 'images/team-member1.jpg',
        description: 'Former event director with 15+ years experience in creating memorable experiences. '
      },
      {
        name: 'Michael Chen',
        role: 'CTO',
        image: 'images/team-member2.jpg',
        description: 'Tech visionary specializing in scalable platforms and user experience design.'
      },
      {
        name: 'Emily Rodriguez',
        role: 'Head of Marketing',
        image: 'images/team-member4.jpg',
        description: 'Creative strategist passionate about connecting brands with their audiences.'
      },
      {
        name: 'David Kim',
        role: 'Lead Developer',
        image: 'images/team-member3.jpg',
        description: 'Full-stack engineer focused on building robust and intuitive event solutions.'
      },
      {
        name: 'Lisa Thompson',
        role: 'Customer Success',
        image: 'images/team-member6.jpg',
        description: 'Dedicated to ensuring every client achieves their event goals and beyond.'
      },
      {
        name: 'James Wilson',
        role: 'Product Designer',
        image: 'images/team-member5.jpg',
        description: 'UX expert crafting intuitive interfaces that make event management effortless.'
      }
    ]

}
