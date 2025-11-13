import { PaymentSettings } from "../model/payment.model";


export enum PAYMENT_TYPES {
    BANK = "Bank",
    MoMo = "MoMo",
}


export const paymentSetting: PaymentSettings = [
    {
        title: "Bank Account",
        active: false,
        backned_key: 'account_type',
        type:PAYMENT_TYPES.BANK,
        fields: [
            [
                {
                    label: "Bank Name",
                    type: "select",
                    options: [{ label: "GCB", value: "GCB" }],
                    backned_key: 'bank_name'
                },
                {
                    label: "Branch Sort Code",
                    type: "text",
                    backned_key: 'bank_sort_code'
                },
            ],
            [
                {
                    label: "Bank Account Number",
                    type: "text",
                    backned_key: 'bank_account_number',

                },
                {
                    label: "Account Holder Name",
                    type: "text",
                    backned_key: 'bank_account_name',
                },
            ],
        ],
    },
    {
        title: "Mobile Money",
        active: false,
        backned_key: 'account_type',
        type:PAYMENT_TYPES.MoMo,
        fields: [
            [
                {
                    label: "Network Operator",
                    type: "select",
                    options: [{ label: "MTN MoMo", value: "MTN MoMo" }],
                    backned_key: 'momo_operator',

                },
                {
                    label: "Registered Mobile Money Number",
                    type: "tel",
                    backned_key: 'momo_number',

                },
            ],
            [
                {
                    label: "Account Holder Name",
                    type: "text",
                    backned_key: 'momo_name',
                },
            ]
        ],
    },
];


