// Wrapper component for AlertBar
import { AlertBar } from '~elements'
import type { AlertBarProps } from '~elements/AlertBar/AlertBar'

const ResourceAlert = ({ alert }: { alert: AlertBarProps | null }) => {
  if (!alert) return null

  return <AlertBar autoDismiss key={alert.id} message={alert.message} status={alert.status} />
}

export default ResourceAlert
