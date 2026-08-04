const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

// Site Office has no dedicated home-page product entry (its copy is
// hardcoded in journey/showcase/CopyOverlay.jsx), but the /products
// carousel needs its own 6-image set to match the other three cabins.
export const siteOfficeImages = [
  { src: pexels(236705), alt: 'Site Office Cabin exterior on-site' },
  { src: pexels(19503548), alt: 'Modern site office building exterior' },
  { src: pexels(8606292), alt: 'Site Office Cabin interior workspace' },
  { src: pexels(21284473), alt: 'Site Office Cabin exterior against sky' },
  { src: pexels(7014764), alt: 'Site Office Cabin interior desk setup' },
  { src: pexels(3801167), alt: 'Site Office Cabin interior with glass walls' },
];

// Product sections rendered after the Site Office showcase (which has its
// own custom 3D cabin section — see components/home/SiteOfficeSection.jsx).
export const products = [
  {
    id: 'labour',
    right: true,
    model: 'MODEL 02 / LA-SERIES',
    title: 'Labour Accommodation Cabin',
    desc: "Modules that connect end-to-end to house crews of any size — private bays, shared walkways, and ventilation engineered for long stays.",
    specs: ['Multi-module linking', 'High-density layouts', 'Ventilated & insulated', 'Rapid scale-up on site'],
    exteriorSrc: 'https://images.pexels.com/photos/12444957/pexels-photo-12444957.jpeg?auto=compress&cs=tinysrgb&w=1600',
    interiorSrc: 'https://images.pexels.com/photos/35531303/pexels-photo-35531303.jpeg?auto=compress&cs=tinysrgb&w=1600',
    exteriorAlt: 'Labour Accommodation Cabin exterior',
    interiorAlt: 'Labour Accommodation Cabin interior',
    images: [
      { src: pexels(12444957), alt: 'Labour Accommodation Cabin exterior' },
      { src: pexels(35531303), alt: 'Labour Accommodation Cabin interior' },
      { src: pexels(5158458), alt: 'Labour Accommodation Cabin bunk room' },
      { src: pexels(7969098), alt: 'Labour Accommodation Cabin shared bunk area' },
      { src: pexels(122164), alt: 'Labour Accommodation Cabin module exterior' },
      { src: pexels(17642042), alt: 'Labour Accommodation Cabin facade' },
    ],
  },
  {
    id: 'conference',
    right: false,
    model: 'MODEL 03 / CF-SERIES',
    title: 'Conference Cabin',
    desc: 'A glass-fronted meeting space that feels nothing like a site shed — premium interior finishes for client walk-throughs and project reviews.',
    specs: ['Full glass frontage', 'Premium interior finish', 'Meeting-ready setup', 'Climate controlled'],
    exteriorSrc: 'https://images.pexels.com/photos/12444982/pexels-photo-12444982.jpeg?auto=compress&cs=tinysrgb&w=1600',
    interiorSrc: 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=1600',
    exteriorAlt: 'Conference Cabin exterior',
    interiorAlt: 'Conference Cabin interior',
    images: [
      { src: pexels(12444982), alt: 'Conference Cabin exterior' },
      { src: pexels(260689), alt: 'Conference Cabin interior' },
      { src: pexels(6794926), alt: 'Conference Cabin glass-walled meeting room' },
      { src: pexels(6045027), alt: 'Conference Cabin meeting table' },
      { src: pexels(7793653), alt: 'Conference Cabin in use during a meeting' },
      { src: pexels(260856), alt: 'Conference Cabin architecture detail' },
    ],
  },
  {
    id: 'storage',
    right: true,
    model: 'MODEL 04 / ST-SERIES',
    title: 'Storage Cabin',
    desc: "Heavy-duty, closed-shell storage built to guard tools, materials and inventory against site conditions — and against anyone who shouldn't be in there.",
    specs: ['Reinforced steel shell', 'Tamper-resistant shutter', 'Stackable units', 'Secure locking system'],
    exteriorSrc: 'https://images.pexels.com/photos/29415315/pexels-photo-29415315.jpeg?auto=compress&cs=tinysrgb&w=1600',
    interiorSrc: 'https://images.pexels.com/photos/10284048/pexels-photo-10284048.jpeg?auto=compress&cs=tinysrgb&w=1600',
    exteriorAlt: 'Storage Cabin exterior',
    interiorAlt: 'Storage Cabin interior',
    images: [
      { src: pexels(29415315), alt: 'Storage Cabin exterior' },
      { src: pexels(10284048), alt: 'Storage Cabin interior' },
      { src: pexels(33677410), alt: 'Storage Cabin stacked container units' },
      { src: pexels(2226458), alt: 'Storage Cabin aerial view of container yard' },
      { src: pexels(8782714), alt: 'Storage Cabin industrial storage area' },
      { src: pexels(4440800), alt: 'Storage Cabin interior stacked boxes' },
    ],
  },
];
