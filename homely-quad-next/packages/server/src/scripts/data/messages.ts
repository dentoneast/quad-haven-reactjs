export const messagesData = [
  // Conversation between Tenant 4 (Mike) and Landlord 2 (John) about lease
  {
    // senderId: 4 (Mike - tenant)
    // recipientId: 2 (John - landlord)
    // propertyId: 1 (Sunset Gardens)
    subject: 'Lease Renewal Question',
    body: 'Hi John, I wanted to discuss renewing my lease when it expires at the end of the year. Are you open to renewal discussions?',
    isRead: true,
    createdAt: new Date('2024-01-10T09:00:00Z'),
  },
  {
    // senderId: 2 (John - landlord)
    // recipientId: 4 (Mike - tenant)
    // propertyId: 1
    subject: 'Re: Lease Renewal Question',
    body: 'Hi Mike! Absolutely, I\'d be happy to discuss renewal. You\'ve been a great tenant. Let\'s schedule a time to talk about terms.',
    isRead: true,
    createdAt: new Date('2024-01-10T14:30:00Z'),
  },
  // Conversation about maintenance request
  {
    // senderId: 4 (Mike - tenant)
    // recipientId: 2 (John - landlord)
    // propertyId: 1
    subject: 'Maintenance Request Follow-up',
    body: 'I submitted a maintenance request for the leaky faucet. Has the maintenance team been notified?',
    isRead: true,
    createdAt: new Date('2024-01-16T10:00:00Z'),
  },
  {
    // senderId: 2 (John - landlord)
    // recipientId: 4 (Mike - tenant)
    // propertyId: 1
    subject: 'Re: Maintenance Request Follow-up',
    body: 'Yes, Tom our maintenance person has been notified. He should be there tomorrow between 9 AM and 12 PM. Thanks for reporting this!',
    isRead: true,
    createdAt: new Date('2024-01-16T11:30:00Z'),
  },
  // Payment discussion
  {
    // senderId: 5 (Emma - tenant)
    // recipientId: 2 (John - landlord)
    // propertyId: 1
    subject: 'Payment Method Update',
    body: 'Hi, I\'d like to switch my payment method from credit card to bank transfer. How can I update this?',
    isRead: true,
    createdAt: new Date('2024-01-20T15:00:00Z'),
  },
  {
    // senderId: 2 (John - landlord)
    // recipientId: 5 (Emma - tenant)
    // propertyId: 1
    subject: 'Re: Payment Method Update',
    body: 'Hi Emma, you can update your payment method in your profile settings under "Payment Methods". Let me know if you need any help with this.',
    isRead: false,
    createdAt: new Date('2024-01-21T09:00:00Z'),
  },
  // General inquiry
  {
    // senderId: 6 (Alex - tenant)
    // recipientId: 2 (John - landlord)
    // propertyId: 2
    subject: 'Parking Pass Request',
    body: 'Hello, I need an additional parking pass for a guest who will be staying for a few weeks. Is this possible?',
    isRead: false,
    createdAt: new Date('2024-01-24T12:00:00Z'),
  },
  // Between tenants (community message)
  {
    // senderId: 4 (Mike - tenant)
    // recipientId: 5 (Emma - tenant)
    // propertyId: 1
    subject: 'Welcome to the building!',
    body: 'Hi Emma, I saw you just moved in to unit 202. Welcome to Sunset Gardens! If you need any recommendations for local restaurants or services, feel free to ask.',
    isRead: true,
    createdAt: new Date('2024-02-05T18:00:00Z'),
  },
  {
    // senderId: 5 (Emma - tenant)
    // recipientId: 4 (Mike - tenant)
    // propertyId: 1
    subject: 'Re: Welcome to the building!',
    body: 'Thanks so much Mike! That\'s very kind of you. I\'d love some restaurant recommendations. Still getting to know the area.',
    isRead: true,
    createdAt: new Date('2024-02-06T10:00:00Z'),
  },
  // Workman communication
  {
    // senderId: 8 (Tom - workman)
    // recipientId: 4 (Mike - tenant)
    // propertyId: 1
    subject: 'Maintenance Visit Confirmation',
    body: 'Hi Mike, this is Tom from maintenance. I\'ll be there tomorrow at 9 AM to fix your kitchen faucet. Please make sure someone is home to let me in.',
    isRead: true,
    createdAt: new Date('2024-01-17T16:00:00Z'),
  },
  {
    // senderId: 4 (Mike - tenant)
    // recipientId: 8 (Tom - workman)
    // propertyId: 1
    subject: 'Re: Maintenance Visit Confirmation',
    body: 'Thanks Tom! I\'ll be working from home tomorrow so I\'ll be here. See you at 9 AM.',
    isRead: true,
    createdAt: new Date('2024-01-17T17:00:00Z'),
  },
];
