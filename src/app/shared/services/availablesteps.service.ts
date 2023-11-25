import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvailablestepsService {

  constructor() { }

  messageVariablesCategory: any = [
    {
      "categoryTitle" : "Contact",
      "categoryCode" : "contact",
      "allowedflow" : ['automation','appointment','quiz'],
      "variables" : [
        {
          "title" : "Voornaam",
          "formula" : "%fname%"
        },
        {
          "title" : "Achternaam",
          "formula" : "%lname%"
        },
        {
          "title" : "Telefoon",
          "formula" : "%phone%"
        },
        {
          "title" : "Email",
          "formula" : "%email%"
        },
        {
          "title" : "Lead Id",
          "formula" : "%leadid%"
        }
      ]
    },
    {
      "categoryTitle" : "Appointment",
      "categoryCode" : "appointment",
      "allowedflow" : ['appointment'],
      "variables" : [
        {
          "title": "Type",
          "formula": "%atype%"
        },
        {
          "title": "Tijd",
          "formula": "%duration%"
        },
        {
          "title": "Datum en tijd",
          "formula": "%datetime%"
        },
        {
          "title": "Kantoor",
          "formula": "%office%"
        },
        {
          "title": "Scheduling Link",
          "formula": "%slink%"
        },
        {
          "title": "Toevoegen aan Ical / Outlook-agend",
          "formula": "%ical%"
        },
        {
          "title": "Voeg toe aan Google Agenda",
          "formula": "%gcal%"
        },
        {
          "title": "Plannen/Annuleren afspraak",
          "formula": "%rclink%"
        },
        {
          "title": "Naam bron",
          "formula": "%sourcename%"
        }
      ]
    },
    {
      "categoryTitle" : "Automation",
      "categoryCode" : "automation",
      "allowedflow" : ['automation'],
      "variables" : [
        {
          "title": "Automation Name",
          "formula": "%qname%"
        },
        {
          "title": "Automation Link",
          "formula": "%qlink%"
        }
      ]
    },
    {
      "categoryTitle" : "Recruiter",
      "categoryCode" : "recruiter",
      "allowedflow" : ['automation','appointment'],
      "variables" : [
        {
          "title" : "Recruiter voornaam",
          "formula" : "%rfname%"
        },
        {
          "title" : "Recruiter telefoon",
          "formula" : "%rphone%"
        },
        {
          "title" : "Signature",
          "formula" : "%signature%",
          "communicationTypeAllowed" : ["emailMsg"]
        }
      ]
    }
  ]
}
