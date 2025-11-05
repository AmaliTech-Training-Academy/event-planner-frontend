import { TestBed } from '@angular/core/testing';
import 'zone.js';
import 'zone.js/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [CommonModule, RouterTestingModule, ReactiveFormsModule, HttpClientTestingModule],
  });
});
