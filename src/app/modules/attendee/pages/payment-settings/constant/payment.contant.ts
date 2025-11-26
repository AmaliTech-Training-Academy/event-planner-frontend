import { Validators } from "@angular/forms";
import { UserCardData } from "../../../../../core/models";
import { PaymentSettings } from "../model/payment.model";


export enum PAYMENT_TYPES {
    BANK = "Bank",
    MoMo = "MoMo",
}

const BANKS_LIST = [
  { label: "Absa Bank Ghana",     value: "Absa Bank Ghana" },
  { label: "Access Bank (Ghana)", value: "Access Bank (Ghana)" },
  { label: "Agricultural Development Bank", value: "Agricultural Development Bank" },
  { label: "Bank of Africa Ghana", value: "Bank of Africa Ghana" },
  { label: "CalBank",             value: "CalBank" },
  { label: "Consolidated Bank Ghana", value: "Consolidated Bank Ghana" },
  { label: "Ecobank Ghana",       value: "Ecobank Ghana" },
  { label: "FBNBank Ghana",       value: "FBNBank Ghana" },
  { label: "Fidelity Bank Ghana", value: "Fidelity Bank Ghana" },
  { label: "First Atlantic Bank", value: "First Atlantic Bank" },
  { label: "First National Bank Ghana", value: "First National Bank Ghana" },
  { label: "GCB Bank",            value: "GCB Bank" },
  { label: "Guaranty Trust Bank (Ghana)", value: "Guaranty Trust Bank (Ghana)" },
  { label: "National Investment Bank", value: "National Investment Bank" },
  { label: "OmniBSIC Bank Ghana", value: "OmniBSIC Bank Ghana" },
  { label: "Prudential Bank",     value: "Prudential Bank" },
  { label: "Republic Bank Ghana", value: "Republic Bank Ghana" },
  { label: "Société Générale Ghana", value: "Société Générale Ghana" },
  { label: "Stanbic Bank Ghana",  value: "Stanbic Bank Ghana" },
  { label: "Standard Chartered Bank Ghana", value: "Standard Chartered Bank Ghana" },
  { label: "United Bank for Africa Ghana", value: "United Bank for Africa Ghana" },
  { label: "Universal Merchant Bank", value: "Universal Merchant Bank" },
  { label: "Zenith Bank Ghana",   value: "Zenith Bank Ghana" }
];

const MoMoOPERATORS = [
  { label: "MTN MoMo", value: "MTN MoMo" },
  { label: "Vodafone Cash", value: "Vodafone Cash" },
  { label: "AirtelTigo Money", value: "AirtelTigo Money" }
];


export const paymentSetting: PaymentSettings = [
    {
        title: "Bank Account",
        active: false,
        backend_key: 'account_type',
        type: PAYMENT_TYPES.BANK,
        fields: [
            [
                {
                    label: "Bank Name",
                    type: "select",
                    options: BANKS_LIST,
                    backend_key: 'bankName',
                    validators: [Validators.required]
                }
            ],
            [
                {
                    label: "Bank Account Number",
                    type: "number",
                    backend_key: 'accountNumber',
                    validators: [Validators.required,Validators.minLength(12)]

                },
                {
                    label: "Account Holder Name",
                    type: "text",
                    backend_key: 'accountHolderName',
                    validators: [Validators.required]
                },
            ],
        ],
    },
    {
        title: "Mobile Money",
        active: false,
        backend_key: 'account_type',
        type: PAYMENT_TYPES.MoMo,
        fields: [
            [
                {
                    label: "Network Operator",
                    type: "select",
                    options: MoMoOPERATORS,
                    backend_key: 'networkOperator',
                    validators: [Validators.required]

                },
                {
                    label: "Registered Mobile Money Number",
                    type: "tel",
                    backend_key: 'mobileMoneyNumber',
                    validators: [Validators.required, Validators.maxLength(10), Validators.minLength(10)]
                },
            ],
            [
                {
                    label: "Account Holder Name",
                    type: "text",
                    backend_key: 'accountHolderName',
                    validators: [Validators.required,]
                },
            ]
        ],
    },
];


export const MY_EVENT_STAT_CARDS: UserCardData[] = [
    {
        iconColor: '',
        title: 'Total Tickets Sold',
        count: 0,
        icon: 'icons/user-icon-blue.png',
        bgColor: '#F0F9FF',
        backend_key: 'ticketsSold'
    },
    {
        iconColor: '',
        title: 'Total Amount Withdrawn',
        count: 0,
        icon: 'icons/user-icon-orange.png',
        bgColor: '#FFF7EC',
        backend_key: 'amountWithdrawn'
    },
    {
        iconColor: '',
        title: 'Outstanding Balance',
        count: 0,
        icon: 'icons/user-icon-blue.png',
        bgColor: '#F0F9FF',
        backend_key: 'outstandingBalance'
    },
];