import Ui from '@libs/material-ui'
import React from '@libs/react'

interface InfoRow {
  label: string
  value: Nullable<string> | undefined
}

const useStyles = Ui.makeStyles(theme => ({
  root: {
    color: theme.palette.text.primary,
    padding: theme.spacing(3)
  },
  hero: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2.5)
  },
  heroTop: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    }
  },
  brandLockup: {
    alignItems: 'center',
    display: 'flex',
    minWidth: 0
  },
  logo: {
    maxHeight: '100px',
    maxWidth: '150px'
  },
  sessionPanel: {
    alignItems: 'center',
    backgroundColor: theme.palette.action.hover,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    }
  },
  avatarStack: {
    alignItems: 'flex-end',
    display: 'flex',
    flexShrink: 0
  },
  primaryAvatar: {
    border: `3px solid ${theme.palette.background.paper}`,
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.16)',
    fontSize: 28,
    fontWeight: 600,
    height: 76,
    width: 76
  },
  secondaryAvatar: {
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.14)',
    fontSize: 14,
    fontWeight: 600,
    height: 38,
    marginLeft: theme.spacing(-1.5),
    width: 38
  },
  sessionCopy: {
    minWidth: 0
  },
  sessionLabel: {
    fontWeight: 700,
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  sessionSummary: {
    marginTop: theme.spacing(0.5)
  },
  sectionGrid: {
    display: 'grid',
    gap: theme.spacing(2.5),
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    marginBottom: theme.spacing(3)
  },
  infoSection: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    overflow: 'hidden'
  },
  infoTitle: {
    fontWeight: 600,
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  infoRow: {
    display: 'grid',
    gap: theme.spacing(1),
    gridTemplateColumns: '128px minmax(0, 1fr)',
    padding: theme.spacing(1.5, 2),
    '& + &': {
      borderTop: `1px solid ${theme.palette.divider}`
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr'
    }
  },
  infoValue: {
    overflowWrap: 'anywhere'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  primaryAction: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: theme.spacing(1)
    }
  }
}))

function getDisplayValue(value: InfoRow['value']) {
  return value || 'Not available'
}

function getInitials(user: IUser) {
  const name = user.display_name || user.email

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

function getSessionSummary(
  user: IUser,
  brand: IBrand,
  impersonateUser: Nullable<IImpersonateUser>
) {
  if (impersonateUser) {
    return `${user.display_name} is working as ${impersonateUser.display_name} in ${brand.name}.`
  }

  return `${user.display_name} is working in ${brand.name}.`
}

function UserAvatar({ user, className }: { user: IUser; className: string }) {
  return (
    <Ui.Avatar
      alt={user.display_name}
      className={className}
      src={user.profile_image_url || undefined}
    >
      {getInitials(user)}
    </Ui.Avatar>
  )
}

function InfoSection({ title, rows }: { title: string; rows: InfoRow[] }) {
  const classes = useStyles()

  return (
    <Ui.Box className={classes.infoSection}>
      <Ui.Typography className={classes.infoTitle} variant="subtitle1">
        {title}
      </Ui.Typography>

      <Ui.Box>
        {rows.map(row => (
          <Ui.Box key={row.label} className={classes.infoRow}>
            <Ui.Typography color="textSecondary" variant="body2">
              {row.label}
            </Ui.Typography>
            <Ui.Typography className={classes.infoValue} variant="body2">
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
  const activeUser = impersonateUser ?? user
  const sessionSummary = getSessionSummary(user, brand, impersonateUser)

  const handleNotify = () => {
    notify({
      status: 'success',
      message: `Generic app loaded for ${activeUser.display_name}.`
    })
  }

  return (
    <Ui.Box className={classes.root}>
      <Ui.Box className={classes.hero}>
        <Ui.Box className={classes.heroTop}>
          <Ui.Box className={classes.brandLockup}>
            <Ui.Box mr={2}>
              <Logo className={classes.logo} />
            </Ui.Box>
            <Ui.Box minWidth={0}>
              <Ui.Typography variant="h6">Generic App Boilerplate</Ui.Typography>
              <Ui.Typography color="textSecondary" variant="body2">
                Running in the Rechat AppPlatform.
              </Ui.Typography>
            </Ui.Box>
          </Ui.Box>
        </Ui.Box>

        <Ui.Box className={classes.sessionPanel}>
          <Ui.Box className={classes.avatarStack}>
            <UserAvatar className={classes.primaryAvatar} user={activeUser} />
            {impersonateUser && (
              <UserAvatar className={classes.secondaryAvatar} user={user} />
            )}
          </Ui.Box>

          <Ui.Box className={classes.sessionCopy}>
            <Ui.Typography
              className={classes.sessionLabel}
              color="textSecondary"
              variant="caption"
            >
              Current session
            </Ui.Typography>
            <Ui.Typography variant="h6">{activeUser.display_name}</Ui.Typography>
            <Ui.Typography
              className={classes.sessionSummary}
              color="textSecondary"
              variant="body2"
            >
              {sessionSummary}
            </Ui.Typography>
          </Ui.Box>
        </Ui.Box>
      </Ui.Box>

      <Ui.Box className={classes.sectionGrid}>
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
      </Ui.Box>

      <Ui.Box className={classes.actions}>
        <Ui.Button color="primary" variant="outlined" onClick={close}>
          Close
        </Ui.Button>
        <Ui.Box className={classes.primaryAction} ml={1}>
          <Ui.Button color="primary" variant="contained" onClick={handleNotify}>
            Test Notification
          </Ui.Button>
        </Ui.Box>
      </Ui.Box>
    </Ui.Box>
  )
}
