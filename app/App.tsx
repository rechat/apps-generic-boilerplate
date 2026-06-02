import Ui from '@libs/material-ui'
import React from '@libs/react'

interface InfoRow {
  label: string
  value: Nullable<string> | undefined
}

const useStyles = Ui.makeStyles({
  logo: {
    maxHeight: '100px',
    maxWidth: '150px'
  }
})

function getDisplayValue(value: InfoRow['value']) {
  return value || 'Not available'
}

function InfoSection({ title, rows }: { title: string; rows: InfoRow[] }) {
  return (
    <Ui.Box mb={3}>
      <Ui.Typography gutterBottom variant="subtitle1">
        {title}
      </Ui.Typography>

      <Ui.Box border={1} borderColor="divider" borderRadius={4}>
        {rows.map(row => (
          <Ui.Box
            key={row.label}
            display="flex"
            justifyContent="space-between"
            px={2}
            py={1.5}
          >
            <Ui.Typography color="textSecondary" variant="body2">
              {row.label}
            </Ui.Typography>
            <Ui.Typography align="right" variant="body2">
              {getDisplayValue(row.value)}
            </Ui.Typography>
          </Ui.Box>
        ))}
      </Ui.Box>
    </Ui.Box>
  )
}

export function App({
  models: { user, brand, impersonateUser },
  api: { close },
  Components: { Logo },
  utils: { notify }
}: EntryProps) {
  const classes = useStyles()

  const handleNotify = () => {
    const displayName = impersonateUser?.display_name ?? user.display_name

    notify({
      status: 'success',
      message: `Generic app loaded for ${displayName}.`
    })
  }

  return (
    <Ui.Box p={3}>
      <Ui.Box alignItems="center" display="flex" mb={3}>
        <Ui.Box mr={2}>
          <Logo className={classes.logo} />
        </Ui.Box>
        <Ui.Box>
          <Ui.Typography variant="h6">Generic App Boilerplate</Ui.Typography>
          <Ui.Typography color="textSecondary" variant="body2">
            Running from the Today page without a contact context.
          </Ui.Typography>
        </Ui.Box>
      </Ui.Box>

      <InfoSection
        rows={[
          { label: 'Brand name', value: brand.name },
          { label: 'Brand type', value: brand.brand_type },
          { label: 'Brand ID', value: brand.id }
        ]}
        title="Brand"
      />

      <InfoSection
        rows={[
          { label: 'Display name', value: user.display_name },
          { label: 'Email', value: user.email },
          { label: 'User type', value: user.user_type },
          { label: 'Timezone', value: user.timezone }
        ]}
        title="Logged-in User"
      />

      {impersonateUser && (
        <InfoSection
          rows={[
            { label: 'Display name', value: impersonateUser.display_name },
            { label: 'Email', value: impersonateUser.email },
            { label: 'User type', value: impersonateUser.user_type },
            { label: 'Timezone', value: impersonateUser.timezone }
          ]}
          title="Impersonated User"
        />
      )}

      <Ui.Box display="flex" justifyContent="flex-end">
        <Ui.Button color="primary" variant="outlined" onClick={close}>
          Close
        </Ui.Button>
        <Ui.Box ml={1}>
          <Ui.Button color="primary" variant="contained" onClick={handleNotify}>
            Test Notification
          </Ui.Button>
        </Ui.Box>
      </Ui.Box>
    </Ui.Box>
  )
}
