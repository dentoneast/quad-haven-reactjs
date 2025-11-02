export const maintenanceRequestsData = [
  {
    // Unit 1, Tenant 4 (Mike Johnson)
    title: 'Leaky Kitchen Faucet',
    description: 'The kitchen faucet is dripping constantly and needs repair. Water is accumulating under the sink causing potential water damage.',
    priority: 'high',
    status: 'completed',
    category: 'plumbing',
    images: ['leak_1.jpg', 'leak_2.jpg'],
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-18T14:00:00Z'),
    resolvedAt: new Date('2024-01-18T14:00:00Z'),
  },
  {
    // Unit 2, Tenant 5 (Emma Davis)
    title: 'Broken Window Lock',
    description: 'The lock on the bedroom window is broken and won\'t secure properly. This is a security concern that needs immediate attention.',
    priority: 'urgent',
    status: 'in_progress',
    category: 'general',
    images: ['window_lock.jpg'],
    createdAt: new Date('2024-01-20T14:00:00Z'),
    updatedAt: new Date('2024-01-21T10:00:00Z'),
    resolvedAt: null,
  },
  {
    // Unit 4, Tenant 6 (Alex Garcia)
    title: 'HVAC System Not Cooling',
    description: 'The air conditioning unit is not cooling properly. It makes strange noises and only blows warm air even when set to cool.',
    priority: 'urgent',
    status: 'approved',
    category: 'hvac',
    images: ['hvac_unit.jpg'],
    createdAt: new Date('2024-01-22T08:00:00Z'),
    updatedAt: new Date('2024-01-22T09:00:00Z'),
    resolvedAt: null,
  },
  {
    // Unit 6, Tenant 7 (Lisa Martinez)
    title: 'Garbage Disposal Jammed',
    description: 'The garbage disposal is stuck and won\'t turn on. There might be something lodged inside preventing it from operating.',
    priority: 'medium',
    status: 'pending',
    category: 'appliance',
    images: [],
    createdAt: new Date('2024-01-19T11:00:00Z'),
    updatedAt: new Date('2024-01-19T11:00:00Z'),
    resolvedAt: null,
  },
  {
    // Unit 1, Tenant 4 (Mike Johnson)
    title: 'Light Fixture Not Working',
    description: 'The ceiling light in the living room stopped working. Already tried replacing the bulb with no success.',
    priority: 'low',
    status: 'approved',
    category: 'electrical',
    images: [],
    createdAt: new Date('2024-01-23T15:00:00Z'),
    updatedAt: new Date('2024-01-23T16:00:00Z'),
    resolvedAt: null,
  },
  {
    // Unit 2, Tenant 5 (Emma Davis)
    title: 'Water Heater Making Noise',
    description: 'The water heater is making loud banging noises, especially in the morning. Water temperature seems inconsistent.',
    priority: 'medium',
    status: 'pending',
    category: 'plumbing',
    images: ['water_heater.jpg'],
    createdAt: new Date('2024-01-24T09:00:00Z'),
    updatedAt: new Date('2024-01-24T09:00:00Z'),
    resolvedAt: null,
  },
];
