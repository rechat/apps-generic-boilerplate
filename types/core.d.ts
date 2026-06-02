declare type UUID = string
declare type Optional<T> = T | undefined
declare type Nullable<T> = T | null
declare interface Window {
  libs: Record<'React' | 'MaterialUi' | 'ReactUse', any> & {
    Components?: {
      SingleEmailComposeForm: React.FC<SingleEmailComposeFormProps>
    }
  }
}
declare interface CoreComponents {
  Logo: React.FC<LogoProps>
  DatePicker: React.FC<DatePickerProps>
  SingleEmailComposeForm: React.FC<SingleEmailComposeFormProps>
  Wizard: {
    QuestionWizard: React.FC<QuestionWizardProps>
    QuestionSection: React.FC<QuestionSectionProps>
    QuestionTitle: React.FC<QuestionTitleProps>
    QuestionForm: React.FC<QuestionFormProps>
  }
}

declare interface EntryProps {
  models: {
    user: IUser
    brand: IBrand
    impersonateUser: Nullable<IImpersonateUser>
  }
  utils: {
    notify: (data: NotificationData) => void
  }
  api: {
    close: () => void
  }
  hooks: {
    wizard?: {
      useSectionContext: () => IWizardSectionState
      useWizardContext: () => IWizardState
      useSectionErrorContext: () => Optional<string>
    }
  }
  Components: CoreComponents
}
