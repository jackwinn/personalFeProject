const SetupData = {
  files: {
    apiKey: 'VBKV2rL8uDSLzMBsnDGRus5ZTe9M75rDgZr8fMRmgzHsX9uapZDG4jjM94q7JrmQ',
  },
  activeTenantStatus: [
    { label: 'Status', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Payment Due', value: 'Payment Due' },
    { label: 'Tenancy Expired', value: 'Tenancy Expired' },
    { label: 'Run Away', value: 'Run Away' },
    { label: 'Terminated', value: 'Terminated' }
  ],
  tenancyPeriod: [
    { label: 'Select one', value: '' },
    { label: '1 Year', value: '1 Year' },
    { label: '2 Years', value: '2 Year' },
    { label: 'Other', value: 'Other' },
  ],
  nameTitle: [
    { label: 'Select one', value: '' },
    { label: 'Mr', value: 'Mr' },
    { label: 'Mrs', value: 'Mrs' },
    { label: 'Ms', value: 'Ms' },
  ],
  race: [
    { label: 'Select one', value: '' },
    { label: 'Malay', value: 'Malay' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Other', value: 'Other' },
  ],
  gender: [
    { label: 'Select one', value: '' },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ],
  tenancyRenewRequest: [
    { label: 'Pending Respond', value: 'Pending Respond' },
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ],
  checkoutReason: [
    { label: 'Select one', value: '' },
    { label: 'End Contract', value: 'End Contract' },
    { label: 'Change Room', value: 'Change Room' },
    { label: 'Others', value: 'Others' }
  ],

  depositAction: [
    { label: 'Refund Deposit', value: 'Refund Deposit' },
    { label: 'Forfeit Deposit', value: 'Forfeit Deposit' }
  ],

  outstandingAction: [
    { label: 'Pay With Refunds', value: 'Pay With Refunds' },
    { label: 'Mark as Bad Debt', value: 'Mark as Bad Debt' }
  ],

  bankName: [
    { label: 'Select Bank', value: '' },
    { label: 'Affin Bank Berhad', value: 'Affin Bank Berhad' },
    { label: 'Alliance Bank Malaysia Berhad', value: 'Alliance Bank Malaysia Berhad' },
    { label: 'Ambank (M) Berhad', value: 'Ambank (M) Berhad' },
    { label: 'Bank Islam Malaysia Berhad', value: 'Bank Islam Malaysia Berhad' },
    { label: 'Bank Muamalat (Malaysia) Berhad', value: 'Bank Muamalat (Malaysia) Berhad' },
    { label: 'Bank Rakyat', value: 'Bank Rakyat' },
    { label: 'CIMB Bank Berhad', value: 'CIMB Bank Berhad' },
    { label: 'Citibank Bank Berhad', value: 'Citibank Bank Berhad' },
    { label: 'GXBank', value: 'GXBank' },
    { label: 'Hong Leong Bank Berhad', value: 'Hong Leong Bank Berhad' },
    { label: 'HSBC Bank Malaysia Berhad', value: 'HSBC Bank Malaysia Berhad' },
    { label: 'CIMB Bank Berhad', value: 'CIMB Bank Berhad' },
    { label: 'Citibank Bank Berhad', value: 'Citibank Bank Berhad' },
    { label: 'Maybank Berhad', value: 'Maybank Berhad' },
    { label: 'MBSB Bank', value: 'MBSB Bank' },
    { label: 'OCBC Bank (Malaysia) Berhad', value: 'OCBC Bank (Malaysia) Berhad' },
    { label: 'Public Bank Berhad', value: 'Public Bank Berhad' },
    { label: 'Maybank Berhad', value: 'Maybank Berhad' },
    { label: 'Standard Chartered Bank (Malaysia) Berhad', value: 'Standard Chartered Bank (Malaysia) Berhad' },
    { label: 'United Oversea Bank (Malaysia) Berhad', value: 'United Oversea Bank (Malaysia) Berhad' },
  ],
  ewalletName: [
    {label: 'Select one', value: ''},
    {label: 'Boost', value: 'Boost'},
    {label: 'GrabPay', value: 'GrabPay'},
    {label: 'MAE', value: 'MAE'},
    {label: 'PayPal', value: 'PayPal'},
    {label: 'Setel', value: 'Setel'},
    {label: 'Shopee Pay', value: 'Shopee Pay'},
    {label: `Touch 'n Go`, value: `Touch 'n Go`},
  ],
  paymentMethod: [
    {label: 'Select one', value: ''},
    {label: 'Debit/Credit Card', value: 'Debit/Credit Card'},
    {label: 'E-Wallet', value: 'E-Wallet'},
    {label: 'FPX Online Banking', value: 'FPX Online Banking'}
  ],
  billType: [
    { label: 'Select one', value: '' },
    { label: 'Access Card Deposit', value: 'Access Card Deposit' },
    { label: 'Electricity', value: 'Electricity' },
    { label: 'Forfeit Deposit', value: 'Forfeit Deposit' },
    { label: 'Furniture Deposit', value: 'Furniture Deposit' },
    { label: 'Others', value: 'Others' },
    { label: 'Others - Deposit', value: 'Others - Deposit' },
    { label: 'Processing Fees', value: 'Processing Fees' },
    { label: 'Refund', value: 'Refund' },
    { label: 'Rental Deposit', value: 'Rental Deposit' },
    { label: 'Rental Fee', value: 'Rental Fee' },
    { label: 'Utility Deposit', value: 'Utility Deposit' },
    { label: 'Water', value: 'Water' },
  ],
  billStatus: [
    { label: 'Status', value: '' },
    { label: 'New', value: 'New' },
    { label: 'Issued', value: 'Issued' },
    { label: 'Issued - Payment In Progress', value: 'Issued - Payment In Progress' },
    { label: 'Issued - Payment Failed', value: 'Issued - Payment Failed' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Bad Debt', value: 'Bad Debt' },
  ],
  billStatusLabel: [
    { label: 'New', value: 'New' },
    { label: 'Issued', value: 'Issued' },
    { label: 'Issued - Payment In Progress', value: 'Issued - Payment In Progress' },
    { label: 'Issued - Payment Failed', value: 'Issued - Payment Failed' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Bad Debt', value: 'Bad Debt' },
  ],
  meterStatus: [
    { label: 'Status', value: '' },
    { label: 'Disconnected', value: 1 },
    { label: 'Offline', value: 2 },
    { label: 'Connected - Power On', value: 3 },
    { label: 'Connected - Power Off', value: 4 },
    { label: 'Waiting for installation', value: 5 },
    { label: 'Waiting for removal', value: 6 },
  ],
}

export default SetupData
