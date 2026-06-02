declare interface SingleEmailComposeFormProps {
  initialValues?: {
    to?: Array<{ email: string; recipient_type: string }>
    cc?: Array<{ email: string; recipient_type: string }>
    bcc?: Array<{ email: string; recipient_type: string }>
    from?: string
    subject?: string
    body?: string
    attachments?: IFile[]
  }
  onClose?: () => void
  onSent?: (
    email: IEmailCampaign<
      'emails' | 'template' | 'from' | 'recipients',
      'contact',
      'email'
    >
  ) => void
  disableAddNewRecipient?: boolean
  emailId?: string
  deal?: IDeal
  headers?: Record<string, string>
}
