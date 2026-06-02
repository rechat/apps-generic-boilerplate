declare interface IBrand extends IModel<'brand'> {
  name: string
  brand_type: 'Team' | 'Brokerage' | 'Office' | 'Personal' | 'Other' | 'Region'
  base_url?: string
}
