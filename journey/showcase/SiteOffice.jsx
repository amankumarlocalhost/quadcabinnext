import CabinExterior from '../CabinExterior.jsx';

// static driver so the door stays shut and this is fully decoupled from the
// home page's `journey.p` — the showcase only spins the cabin, it never opens it.
const STATIC_DRIVER = { p: 0 };

export default function SiteOffice(){
  return <CabinExterior driver={STATIC_DRIVER} />;
}
