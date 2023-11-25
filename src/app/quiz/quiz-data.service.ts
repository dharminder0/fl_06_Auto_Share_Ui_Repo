import { Injectable } from "@angular/core";
import * as moment from "moment";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable, Subject } from "rxjs";
import { CssVarsService } from "../shared/services/cssVarsService.service";
import { FroalaEditorOptions } from "../quiz-builder/email-sms/template-body/template-froala-options";

@Injectable()
export class QuizDataService {
  quizCode: string;
  defaultTitle = "Automation";
  primaryColor = "#00b7ab";
  secondaryColor = "#000000";
  public userTypeId = "";
  public googleApiLocation:boolean = true;
  public cureentLocationCode:any;
  public postalCountryList = [
    {countryName : "Afghanistan", value : "AF", label: "AFG"},
    {countryName : "Albania", value : "AL", label: "ALB"},
    {countryName : "Algeria", value : "DZ", label: "DZA"},
    {countryName : "American Samoa", value : "AS", label: "ASM"},
    {countryName : "Andorra", value : "AD", label: "AND"},
    {countryName : "Angola", value : "AO", label: "AGO"},
    {countryName : "Anguilla", value : "AI", label: "AIA"},
    {countryName : "Antarctica", value : "AQ", label: "ATA"},
    {countryName : "Antigua and Barbuda", value : "AG", label: "ATG"},
    {countryName : "Argentina", value : "AR", label: "ARG"},
    {countryName : "Armenia", value : "AM", label: "ARM"},
    {countryName : "Aruba", value : "AW", label: "ABW"},
    {countryName : "Australia", value : "AU", label: "AUS"},
    {countryName : "Austria", value : "AT", label: "AUT"},
    {countryName : "Azerbaijan", value : "AZ", label: "AZE"},
    {countryName : "Bahamas (the)", value : "BS", label: "BHS"},
    {countryName : "Bahrain", value : "BH", label: "BHR"},
    {countryName : "Bangladesh", value : "BD", label: "BGD"},
    {countryName : "Barbados", value : "BB", label: "BRB"},
    {countryName : "Belarus", value : "BY", label: "BLR"},
    {countryName : "Belgium", value : "BE", label: "BEL"},
    {countryName : "Belize", value : "BZ", label: "BLZ"},
    {countryName : "Benin", value : "BJ", label: "BEN"},
    {countryName : "Bermuda", value : "BM", label: "BMU"},
    {countryName : "Bhutan", value : "BT", label: "BTN"},
    {countryName : "Bolivia (Plurinational State of)", value : "BO", label: "BOL"},
    {countryName : "Bonaire, Sint Eustatius and Saba", value : "BQ", label: "BES"},
    {countryName : "Bosnia and Herzegovina", value : "BA", label: "BIH"},
    {countryName : "Botswana", value : "BW", label: "BWA"},
    {countryName : "Bouvet Island", value : "BV", label: "BVT"},
    {countryName : "Brazil", value : "BR", label: "BRA"},
    {countryName : "British Indian Ocean Territory (the)", value : "IO", label: "IOT"},
    {countryName : "Brunei Darussalam", value : "BN", label: "BRN"},
    {countryName : "Bulgaria", value : "BG", label: "BGR"},
    {countryName : "Burkina Faso", value : "BF", label: "BFA"},
    {countryName : "Burundi", value : "BI", label: "BDI"},
    {countryName : "Cabo Verde", value : "CV", label: "CPV"},
    {countryName : "Cambodia", value : "KH", label: "KHM"},
    {countryName : "Cameroon", value : "CM", label: "CMR"},
    {countryName : "Canada", value : "CA", label: "CAN"},
    {countryName : "Cayman Islands (the)", value : "KY", label: "CYM"},
    {countryName : "Central African Republic (the)", value : "CF", label: "CAF"},
    {countryName : "Chad", value : "TD", label: "TCD"},
    {countryName : "Chile", value : "CL", label: "CHL"},
    {countryName : "China", value : "CN", label: "CHN"},
    {countryName : "Christmas Island", value : "CX", label: "CXR"},
    {countryName : "Cocos (Keeling) Islands (the)", value : "CC", label: "CCK"},
    {countryName : "Colombia", value : "CO", label: "COL"},
    {countryName : "Comoros (the)", value : "KM", label: "COM"},
    {countryName : "Congo (the Democratic Republic of the)", value : "CD", label: "COD"},
    {countryName : "Congo (the)", value : "CG", label: "COG"},
    {countryName : "Cook Islands (the)", value : "CK", label: "COK"},
    {countryName : "Costa Rica", value : "CR", label: "CRI"},
    {countryName : "Croatia", value : "HR", label: "HRV"},
    {countryName : "Cuba", value : "CU", label: "CUB"},
    {countryName : "Curaçao", value : "CW", label: "CUW"},
    {countryName : "Cyprus", value : "CY", label: "CYP"},
    {countryName : "Czechia", value : "CZ", label: "CZE"},
    {countryName : "Côte d'Ivoire", value : "CI", label: "CIV"},
    {countryName : "Denmark", value : "DK", label: "DNK"},
    {countryName : "Djibouti", value : "DJ", label: "DJI"},
    {countryName : "Dominica", value : "DM", label: "DMA"},
    {countryName : "Dominican Republic (the)", value : "DO", label: "DOM"},
    {countryName : "Ecuador", value : "EC", label: "ECU"},
    {countryName : "Egypt", value : "EG", label: "EGY"},
    {countryName : "El Salvador", value : "SV", label: "SLV"},
    {countryName : "Equatorial Guinea", value : "GQ", label: "GNQ"},
    {countryName : "Eritrea", value : "ER", label: "ERI"},
    {countryName : "Estonia", value : "EE", label: "EST"},
    {countryName : "Eswatini", value : "SZ", label: "SWZ"},
    {countryName : "Ethiopia", value : "ET", label: "ETH"},
    {countryName : "Falkland Islands (the) [Malvinas]", value : "FK", label: "FLK"},
    {countryName : "Faroe Islands (the)", value : "FO", label: "FRO"},
    {countryName : "Fiji", value : "FJ", label: "FJI"},
    {countryName : "Finland", value : "FI", label: "FIN"},
    {countryName : "France", value : "FR", label: "FRA"},
    {countryName : "French Guiana", value : "GF", label: "GUF"},
    {countryName : "French Polynesia", value : "PF", label: "PYF"},
    {countryName : "French Southern Territories (the)", value : "TF", label: "ATF"},
    {countryName : "Gabon", value : "GA", label: "GAB"},
    {countryName : "Gambia (the)", value : "GM", label: "GMB"},
    {countryName : "Georgia", value : "GE", label: "GEO"},
    {countryName : "Germany", value : "DE", label: "DEU"},
    {countryName : "Ghana", value : "GH", label: "GHA"},
    {countryName : "Gibraltar", value : "GI", label: "GIB"},
    {countryName : "Greece", value : "GR", label: "GRC"},
    {countryName : "Greenland", value : "GL", label: "GRL"},
    {countryName : "Grenada", value : "GD", label: "GRD"},
    {countryName : "Guadeloupe", value : "GP", label: "GLP"},
    {countryName : "Guam", value : "GU", label: "GUM"},
    {countryName : "Guatemala", value : "GT", label: "GTM"},
    {countryName : "Guernsey", value : "GG", label: "GGY"},
    {countryName : "Guinea", value : "GN", label: "GIN"},
    {countryName : "Guinea-Bissau", value : "GW", label: "GNB"},
    {countryName : "Guyana", value : "GY", label: "GUY"},
    {countryName : "Haiti", value : "HT", label: "HTI"},
    {countryName : "Heard Island and McDonald Islands", value : "HM", label: "HMD"},
    {countryName : "Holy See (the)", value : "VA", label: "VAT"},
    {countryName : "Honduras", value : "HN", label: "HND"},
    {countryName : "Hong Kong", value : "HK", label: "HKG"},
    {countryName : "Hungary", value : "HU", label: "HUN"},
    {countryName : "Iceland", value : "IS", label: "ISL"},
    {countryName : "India", value : "IN", label: "IND"},
    {countryName : "Indonesia", value : "ID", label: "IDN"},
    {countryName : "Iran (Islamic Republic of)", value : "IR", label: "IRN"},
    {countryName : "Iraq", value : "IQ", label: "IRQ"},
    {countryName : "Ireland", value : "IE", label: "IRL"},
    {countryName : "Isle of Man", value : "IM", label: "IMN"},
    {countryName : "Israel", value : "IL", label: "ISR"},
    {countryName : "Italy", value : "IT", label: "ITA"},
    {countryName : "Jamaica", value : "JM", label: "JAM"},
    {countryName : "Japan", value : "JP", label: "JPN"},
    {countryName : "Jersey", value : "JE", label: "JEY"},
    {countryName : "Jordan", value : "JO", label: "JOR"},
    {countryName : "Kazakhstan", value : "KZ", label: "KAZ"},
    {countryName : "Kenya", value : "KE", label: "KEN"},
    {countryName : "Kiribati", value : "KI", label: "KIR"},
    {countryName : "Korea (the Democratic People's Republic of)", value : "KP", label: "PRK"},
    {countryName : "Korea (the Republic of)", value : "KR", label: "KOR"},
    {countryName : "Kuwait", value : "KW", label: "KWT"},
    {countryName : "Kyrgyzstan", value : "KG", label: "KGZ"},
    {countryName : "Lao People's Democratic Republic (the)", value : "LA", label: "LAO"},
    {countryName : "Latvia", value : "LV", label: "LVA"},
    {countryName : "Lebanon", value : "LB", label: "LBN"},
    {countryName : "Lesotho", value : "LS", label: "LSO"},
    {countryName : "Liberia", value : "LR", label: "LBR"},
    {countryName : "Libya", value : "LY", label: "LBY"},
    {countryName : "Liechtenstein", value : "LI", label: "LIE"},
    {countryName : "Lithuania", value : "LT", label: "LTU"},
    {countryName : "Luxembourg", value : "LU", label: "LUX"},
    {countryName : "Macao", value : "MO", label: "MAC"},
    {countryName : "Madagascar", value : "MG", label: "MDG"},
    {countryName : "Malawi", value : "MW", label: "MWI"},
    {countryName : "Malaysia", value : "MY", label: "MYS"},
    {countryName : "Maldives", value : "MV", label: "MDV"},
    {countryName : "Mali", value : "ML", label: "MLI"},
    {countryName : "Malta", value : "MT", label: "MLT"},
    {countryName : "Marshall Islands (the)", value : "MH", label: "MHL"},
    {countryName : "Martinique", value : "MQ", label: "MTQ"},
    {countryName : "Mauritania", value : "MR", label: "MRT"},
    {countryName : "Mauritius", value : "MU", label: "MUS"},
    {countryName : "Mayotte", value : "YT", label: "MYT"},
    {countryName : "Mexico", value : "MX", label: "MEX"},
    {countryName : "Micronesia (Federated States of)", value : "FM", label: "FSM"},
    {countryName : "Moldova (the Republic of)", value : "MD", label: "MDA"},
    {countryName : "Monaco", value : "MC", label: "MCO"},
    {countryName : "Mongolia", value : "MN", label: "MNG"},
    {countryName : "Montenegro", value : "ME", label: "MNE"},
    {countryName : "Montserrat", value : "MS", label: "MSR"},
    {countryName : "Morocco", value : "MA", label: "MAR"},
    {countryName : "Mozambique", value : "MZ", label: "MOZ"},
    {countryName : "Myanmar", value : "MM", label: "MMR"},
    {countryName : "Namibia", value : "NA", label: "NAM"},
    {countryName : "Nauru", value : "NR", label: "NRU"},
    {countryName : "Nepal", value : "NP", label: "NPL"},
    {countryName : "Netherlands (the)", value : "NL", label: "NLD"},
    {countryName : "New Caledonia", value : "NC", label: "NCL"},
    {countryName : "New Zealand", value : "NZ", label: "NZL"},
    {countryName : "Nicaragua", value : "NI", label: "NIC"},
    {countryName : "Niger (the)", value : "NE", label: "NER"},
    {countryName : "Nigeria", value : "NG", label: "NGA"},
    {countryName : "Niue", value : "NU", label: "NIU"},
    {countryName : "Norfolk Island", value : "NF", label: "NFK"},
    {countryName : "Northern Mariana Islands (the)", value : "MP", label: "MNP"},
    {countryName : "Norway", value : "NO", label: "NOR"},
    {countryName : "Oman", value : "OM", label: "OMN"},
    {countryName : "Pakistan", value : "PK", label: "PAK"},
    {countryName : "Palau", value : "PW", label: "PLW"},
    {countryName : "Palestine, State of", value : "PS", label: "PSE"},
    {countryName : "Panama", value : "PA", label: "PAN"},
    {countryName : "Papua New Guinea", value : "PG", label: "PNG"},
    {countryName : "Paraguay", value : "PY", label: "PRY"},
    {countryName : "Peru", value : "PE", label: "PER"},
    {countryName : "Philippines (the)", value : "PH", label: "PHL"},
    {countryName : "Pitcairn", value : "PN", label: "PCN"},
    {countryName : "Poland", value : "PL", label: "POL"},
    {countryName : "Portugal", value : "PT", label: "PRT"},
    {countryName : "Puerto Rico", value : "PR", label: "PRI"},
    {countryName : "Qatar", value : "QA", label: "QAT"},
    {countryName : "Republic of North Macedonia", value : "MK", label: "MKD"},
    {countryName : "Romania", value : "RO", label: "ROU"},
    {countryName : "Russian Federation (the)", value : "RU", label: "RUS"},
    {countryName : "Rwanda", value : "RW", label: "RWA"},
    {countryName : "Réunion", value : "RE", label: "REU"},
    {countryName : "Saint Barthélemy", value : "BL", label: "BLM"},
    {countryName : "Saint Helena, Ascension and Tristan da Cunha", value : "SH", label: "SHN"},
    {countryName : "Saint Kitts and Nevis", value : "KN", label: "KNA"},
    {countryName : "Saint Lucia", value : "LC", label: "LCA"},
    {countryName : "Saint Martin (French part)", value : "MF", label: "MAF"},
    {countryName : "Saint Pierre and Miquelon", value : "PM", label: "SPM"},
    {countryName : "Saint Vincent and the Grenadines", value : "VC", label: "VCT"},
    {countryName : "Samoa", value : "WS", label: "WSM"},
    {countryName : "San Marino", value : "SM", label: "SMR"},
    {countryName : "Sao Tome and Principe", value : "ST", label: "STP"},
    {countryName : "Saudi Arabia", value : "SA", label: "SAU"},
    {countryName : "Senegal", value : "SN", label: "SEN"},
    {countryName : "Serbia", value : "RS", label: "SRB"},
    {countryName : "Seychelles", value : "SC", label: "SYC"},
    {countryName : "Sierra Leone", value : "SL", label: "SLE"},
    {countryName : "Singapore", value : "SG", label: "SGP"},
    {countryName : "Sint Maarten (Dutch part)", value : "SX", label: "SXM"},
    {countryName : "Slovakia", value : "SK", label: "SVK"},
    {countryName : "Slovenia", value : "SI", label: "SVN"},
    {countryName : "Solomon Islands", value : "SB", label: "SLB"},
    {countryName : "Somalia", value : "SO", label: "SOM"},
    {countryName : "South Africa", value : "ZA", label: "ZAF"},
    {countryName : "South Georgia and the South Sandwich Islands", value : "GS", label: "SGS"},
    {countryName : "South Sudan", value : "SS", label: "SSD"},
    {countryName : "Spain", value : "ES", label: "ESP"},
    {countryName : "Sri Lanka", value : "LK", label: "LKA"},
    {countryName : "Sudan (the)", value : "SD", label: "SDN"},
    {countryName : "Suriname", value : "SR", label: "SUR"},
    {countryName : "Svalbard and Jan Mayen", value : "SJ", label: "SJM"},
    {countryName : "Sweden", value : "SE", label: "SWE"},
    {countryName : "Switzerland", value : "CH", label: "CHE"},
    {countryName : "Syrian Arab Republic", value : "SY", label: "SYR"},
    {countryName : "Taiwan (Province of China)", value : "TW", label: "TWN"},
    {countryName : "Tajikistan", value : "TJ", label: "TJK"},
    {countryName : "Tanzania, United Republic of", value : "TZ", label: "TZA"},
    {countryName : "Thailand", value : "TH", label: "THA"},
    {countryName : "Timor-Leste", value : "TL", label: "TLS"},
    {countryName : "Togo", value : "TG", label: "TGO"},
    {countryName : "Tokelau", value : "TK", label: "TKL"},
    {countryName : "Tonga", value : "TO", label: "TON"},
    {countryName : "Trinidad and Tobago", value : "TT", label: "TTO"},
    {countryName : "Tunisia", value : "TN", label: "TUN"},
    {countryName : "Turkey", value : "TR", label: "TUR"},
    {countryName : "Turkmenistan", value : "TM", label: "TKM"},
    {countryName : "Turks and Caicos Islands (the)", value : "TC", label: "TCA"},
    {countryName : "Tuvalu", value : "TV", label: "TUV"},
    {countryName : "Uganda", value : "UG", label: "UGA"},
    {countryName : "Ukraine", value : "UA", label: "UKR"},
    {countryName : "United Arab Emirates (the)", value : "AE", label: "ARE"},
    {countryName : "United Kingdom of Great Britain and Northern Ireland (the)", value : "GB", label: "GBR"},
    {countryName : "United States Minor Outlying Islands (the)", value : "UM", label: "UMI"},
    {countryName : "United States of America (the)", value : "US", label: "USA"},
    {countryName : "Uruguay", value : "UY", label: "URY"},
    {countryName : "Uzbekistan", value : "UZ", label: "UZB"},
    {countryName : "Vanuatu", value : "VU", label: "VUT"},
    {countryName : "Venezuela (Bolivarian Republic of)", value : "VE", label: "VEN"},
    {countryName : "Viet Nam", value : "VN", label: "VNM"},
    {countryName : "Virgin Islands (British)", value : "VG", label: "VGB"},
    {countryName : "Virgin Islands (U.S.)", value : "VI", label: "VIR"},
    {countryName : "Wallis and Futuna", value : "WF", label: "WLF"},
    {countryName : "Western Sahara", value : "EH", label: "ESH"},
    {countryName : "Yemen", value : "YE", label: "YEM"},
    {countryName : "Zambia", value : "ZM", label: "ZMB"},
    {countryName : "Zimbabwe", value : "ZW", label: "ZWE"},
    {countryName : "Åland Islands", value : "AX", label: "ALA"}
  ];

  public countryCodeList = [
    { label: "+1", value: "+1" },
    { label: "+7", value: "+7" },
    { label: "+20", value: "+20" },
    { label: "+27", value: "+27" },
    { label: "+30", value: "+30" },
    { label: "+31", value: "+31" },
    { label: "+32", value: "+32" },
    { label: "+33", value: "+33" },
    { label: "+34", value: "+34" },
    { label: "+36", value: "+36" },
    { label: "+39", value: "+39" },
    { label: "+40", value: "+40" },
    { label: "+41", value: "+41" },
    { label: "+42", value: "+42" },
    { label: "+43", value: "+43" },
    { label: "+44", value: "+44" },
    { label: "+45", value: "+45" },
    { label: "+46", value: "+46" },
    { label: "+47", value: "+47" },
    { label: "+48", value: "+48" },
    { label: "+49", value: "+49" },
    { label: "+351", value: "+351" },
    { label: "+352", value: "+352" },
    { label: "+353", value: "+353" },
    { label: "+354", value: "+354" },
    { label: "+356", value: "+356" },
    { label: "+357", value: "+357" },
    { label: "+358", value: "+358" },
    { label: "+359", value: "+359" },
    { label: "+370", value: "+370" },
    { label: "+371", value: "+371" },
    { label: "+372", value: "+372" },
    { label: "+385", value: "+385" },
    { label: "+386", value: "+386" },
    { label: "+420", value: "+420" },
    { label: "+421", value: "+421" }
  ];

  constructor(private cssVarsService: CssVarsService,
    private froalaEditorOptions: FroalaEditorOptions) {}

  /**
   * Function to set color of attempt quiz
   */
  setCompanyColor(primaryColor, secondaryColor){
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
    this.cssVarsService.setVariables({
      '--primary-color': primaryColor,
      '--secondary-color': secondaryColor
      //   "--primary-color": "#00b7ab",
      // "--secondary-color": "#00b7ab"
    });
  }

  getCompanyColor(){
    return {primaryColor: this.primaryColor, secondaryColor: this.secondaryColor};
  }

  /**
   * Defining froala option for attempt and preview quiz 
   * */
  public options;
  getFroalaOption(){
    this.options = this.froalaEditorOptions.setEditorOptions();
    // this.options['contenteditable'] = false
    this.options['placeholderText'] = '';
    this.options['pluginsEnabled']= ['align','colors','fontFamily','fontSize','image','imageManager','lineBreaker','links','lists','paragraphFormat','paragraphStyle','save','table','url','video','codeView','charCounter','charCounterCount','charCounterMax'];
    // this.options['charCounterMax'] = -1;
    this.options['events'] = {
      'froalaEditor.initialized' : function(e, editor) {
        editor.edit.off();
        editor.toolbar.hide();
      }
    }
    return this.options;
  }

  /**
   * Function to get and set userType
   */
  setUserTypeId(id: string){
    this.userTypeId = id;
  }

  getUserTypeId(){
    return this.userTypeId;
  }
  
  /**
   * Function to set quiz code
   * @param quizCode
   */
  setQuizCode(quizCode) {
    this.quizCode = quizCode;
  }

  /**
   * Function to get Quiz code
   */
  getQuizCode() {
    return this.quizCode;
  }

  /**
   * Behaviour subject used for quiz lead panel
   * Below is the working
   *
   * Component  is loaded based on the data from the server
   * there are 5 components that can be loaded to the view
   * each component emits the state to the parent quiz.component via this subject
   * parent component subscribes to this subject and decides which component
   * should be loaded based on the data received from the api
   *
   * e.g if data from the server is Coverdetails then parent component loads
   * coverdetail component. and what the cover detail component emits to the parent component ,
   * it is decided which component to load based on the api result
   */
  public nextStepStatus = new BehaviorSubject<any>(null);

  public QuizBrandingAndStyle;

  setQuizBrandingAndStyle(styleData) {
    this.QuizBrandingAndStyle = styleData;
  }
  getQuizBrandingAndStyle() {
    return this.QuizBrandingAndStyle;
  }

  public quizURL;
  setSharedQuizURL(url) {
    this.quizURL = url;
  }
  getSharedQuizURL() {
    if (this.quizURL) {
      return this.quizURL;
    }
  }

  public quizTitle;
  setQuizTitle(title){
    this.quizTitle = title;
  }
  getQuizTitle(){
    if(this.quizTitle)
      return this.quizTitle
  }

  public SourceId;
  setQuizSourceId(Id){
    this.SourceId = Id;
  }

  public SourceTitle;
  setQuizSourceTitle(title){
    this.SourceTitle = title;
  }

  public quizResult;
  setQuizResult(result){
    this.quizResult = result;
  }
  getQuizResult(){
    if(this.quizResult)
      return this.quizResult
  }

  public tagCode;
  setQuizTagCode(code){
    this.tagCode = code;
  }

  // setting hidden property for multiple results
 public hiddenProperty = new Subject();

  public resultDetailsData: Subject<any> = new Subject();
  setResultDetailsData(details) {
    this.resultDetailsData.next(details);
  }
  getResultDetailsData() {
    return this.resultDetailsData;
  }

  public logoImage:string = "";
  public logoBackGroundColor:string = "";
  public isLogoSubmission: boolean = false;
  public isLogoSubmissionObservable = new BehaviorSubject(this.isLogoSubmission);

  changeIsLogoSubmission() {
      this.isLogoSubmissionObservable.next(this.isLogoSubmission);
  }

  public isScrollSubmission: boolean = false;
  public isScrollSubmissionObservable = new BehaviorSubject(this.isLogoSubmission);

  changeScrollSubmission() {
    this.isScrollSubmissionObservable.next(this.isScrollSubmission);
  }

  public selectedDateInAutomationReport: any = {};
  public selectedDateInAutomationReportObservable = new BehaviorSubject(this.selectedDateInAutomationReport);

  changeSelectedDateInAutomationReport(){
    this.selectedDateInAutomationReportObservable.next(this.selectedDateInAutomationReport);
  }
  
  public isSoundEnableInAttempt: boolean = false;
  public isSoundEnableInAttemptObservable = new BehaviorSubject(this.isSoundEnableInAttempt);

  changeSoundEnableInAttempt(){
    this.isSoundEnableInAttemptObservable.next(this.isSoundEnableInAttempt);
  }

  createDataLayer(category: string,objectId: any,resultTitle: string){
    let jobRockScriptEle = document.createElement('script');
    jobRockScriptEle.innerHTML = `window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(
      {
        "event": "JobrockEvent",
        "jrCategory": "${category}",
        "jrObjectId": ${objectId},
        "jrObjectType": "Automation",
        "jrObjectTitle": "${this.quizTitle ? this.quizTitle : ''}",
        "jrTags": "${this.tagCode ? this.tagCode : ''}",
        "jrResult": "${resultTitle}",
        "jrCaseId": "${this.SourceId ? this.SourceId : ''}",
        "jrCaseTitle": "${this.SourceTitle ? this.SourceTitle : ''}",
        "jrCaseTeam":"",
        "jrSalesPhase":""
      }
    );`
    document.head.appendChild(jobRockScriptEle);
  }

  //set and get google api call
  setGoogleApiCall(data){
    this.googleApiLocation = data;
  }

  getGoogleApiCall(){
    return this.googleApiLocation;
  }

  //set and get current location
  setCurrentLocation(data){
    this.cureentLocationCode = data;
  }

  getCurrentLocation(){
    return this.cureentLocationCode;
  }

}
