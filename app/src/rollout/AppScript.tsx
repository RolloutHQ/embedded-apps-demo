// The one script tag every embedded app needs. Rollout shows the app only
// after this script answers its handshake, and sizes the frame to the height
// it reports. It does nothing outside a frame.
import { appScriptUrl } from "./config";

export function RolloutAppScript() {
  return <script type="module" src={appScriptUrl} async />;
}
