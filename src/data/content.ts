import type {
  BlogPost,
  Brand,
  Category,
  CaseStudy,
  Industry,
  Product,
  Service,
  Solution,
} from '../types'

export const categories: Category[] = [
  { id: 'analytical', name: 'Analytical Instruments' },
  { id: 'lab-equipment', name: 'Lab Equipment' },
  { id: 'consumables', name: 'Consumables' },
  { id: 'chemicals', name: 'Chemicals' },
]

export const industries: Industry[] = [
  { id: 'oil-gas', title: 'Oil & Gas', description: 'Process control, pollution monitoring and compliance solutions for upstream and downstream operators.' },
  { id: 'pharma', title: 'Pharma', description: 'GMP-ready systems, analytics and laboratory automation for pharmaceutical manufacturing.' },
  { id: 'food-bev', title: 'Food & Beverage', description: 'Quality assurance tools to protect production, ingredients and product safety.' },
  { id: 'environment', title: 'Environmental', description: 'Water, air and soil monitoring solutions for sustainable compliance.' },
  { id: 'academic', title: 'Academic', description: 'Modular lab systems and training-ready environments for universities and research centers.' },
]

export const solutions: Solution[] = [
  { id: 'turnkey', title: 'Laboratory Setup', description: 'From concept to commissioning, we deliver turnkey lab ecosystems for modern research facilities.', highlight: 'Turnkey labs. Unmatched precision.' },
  { id: 'automation', title: 'Automation & Smart Labs', description: 'Integrated workflow automation designed to improve throughput, safety, and data integrity.', highlight: 'Smart lab automation for higher efficiency.' },
  { id: 'analytical', title: 'Analytical Solutions', description: 'Advanced instrumentation and analytics for life sciences, chemicals and environmental monitoring.', highlight: 'Precision analytics engineered for results.' },
  { id: 'engineering', title: 'Custom Engineering', description: 'Tailored systems and instrumentation built to your facility, compliance and process requirements.', highlight: 'Custom engineering that scales with your lab.' },
]

export const services: Service[] = [
  { id: 'installation', title: 'Installation & Commissioning', description: 'Complete equipment integration and commissioning with documented handover.', highlight: 'End-to-end implementation support.' },
  { id: 'calibration', title: 'Calibration', description: 'ISO-compliant calibration services for analytical instruments and lab equipment.', highlight: 'Accurate performance, every time.' },
  { id: 'maintenance', title: 'Maintenance & AMC', description: 'Preventive maintenance contracts keep your lab assets operating reliably.', highlight: 'Continuous uptime with managed care.' },
  { id: 'training', title: 'Training', description: 'Technical training programs that empower your team to operate safely and efficiently.', highlight: 'Knowledge transfer for scientific teams.' },
  { id: 'support', title: 'Technical Support', description: 'Remote and on-site support for urgent service, troubleshooting and spare parts.', highlight: 'Fast response for mission-critical labs.' },
]

export const brands: Brand[] = [
  { id: 'exon', name: 'EXON', logo: 'EXON' },
  { id: 'aura', name: 'AURA', logo: 'AURA' },
  { id: 'novus', name: 'NOVUS', logo: 'NOVUS' },
  { id: 'celix', name: 'CELIX', logo: 'CELIX' },
  { id: 'zenith', name: 'ZENITH', logo: 'ZENITH' },
  { id: 'cyte', name: 'CYTE', logo: 'CYTE' },
]

export const products: Product[] = [
  {
    id: 'p-01',
    name: 'SpectraOne UV-Vis Analyzer',
    category: 'Analytical Instruments',
    brand: 'EXON',
    application: 'Pharma / Environmental monitoring',
    description: 'High-throughput optical analysis with advanced data capture and reporting for quality control.',
    specs: {
      'Measurement range': '190–1100 nm',
      'Resolution': '0.1 nm',
      'Sample type': 'Liquid / solid',
      'Connectivity': 'Ethernet, USB, LIMS-ready',
    },
    pdf: '#',
    images: [],
  },
  {
    id: 'p-02',
    name: 'LabFlow Automated Workbench',
    category: 'Lab Equipment',
    brand: 'AURA',
    application: 'Smart labs / Automation',
    description: 'Modular workbench with robotic sample handling for lab automation and traceability.',
    specs: {
      'Configuration': 'Modular workcells',
      'Throughput': 'up to 500 tests/day',
      'Interfaces': 'API, OPC UA, LIMS',
      'Safety': 'Class II compliance',
    },
    pdf: '#',
    images: [],
  },
  {
    id: 'p-03',
    name: 'PurePath Solvent Kits',
    category: 'Consumables',
    brand: 'NOVUS',
    application: 'Analytical chemistry',
    description: 'Certified solvent packs for chromatography and mass spectrometry workflows.',
    specs: {
      'Pack size': '4 x 1L',
      'Purity': 'LC-MS grade',
      'Compatibility': 'HPLC, UHPLC',
      'Storage': 'Ambient',
    },
    pdf: '#',
    images: [],
  },
  {
    id: 'p-04',
    name: 'BioGuard Lab Reagents',
    category: 'Chemicals',
    brand: 'CELIX',
    application: 'Pharma / Bioanalysis',
    description: 'Quality-controlled reagents for molecular diagnostics and laboratory testing workflows.',
    specs: {
      'Grade': 'Analytical',
      'Shelf life': '24 months',
      'Format': 'Liquids and powders',
      'Compliance': 'ISO 17034',
    },
    pdf: '#',
    images: [],
  },
]

export const caseStudies: CaseStudy[] = [
  {
    id: 'c-01',
    title: 'Smart Lab Retrofit for a Leading Pharma Facility',
    industry: 'Pharma',
    summary: 'A complete laboratory retrofit that enabled digital tracking, rapid assay setup and regulatory readiness.',
    problem: 'An aging QC lab could not meet increasing batch release demand or data traceability standards.',
    solution: 'Delivered a turnkey lab upgrade with new analytical instrumentation, automation and integrated software.',
    result: 'Reduced sample turnaround by 38% and improved audit readiness across the facility.',
    images: [],
  },
  {
    id: 'c-02',
    title: 'Automation Rollout for Environmental Monitoring',
    industry: 'Environmental',
    summary: 'Automated laboratory workflows reduced manual handling and sped compliance reporting for water testing.',
    problem: 'Manual workflows created bottlenecks and reporting delays in environmental analysis.',
    solution: 'Implemented automated sample preparation and real-time analytics across multiple labs.',
    result: 'Increased throughput by 45% and cut reporting time in half.',
    images: [],
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: 'b-01',
    title: 'How smart labs are reshaping UAE research infrastructure',
    excerpt: 'Explore the next wave of lab modernization and automation for high-performance scientific facilities.',
    tags: ['Lab automation', 'UAE', 'Innovation'],
    date: '2026-03-12',
  },
  {
    id: 'b-02',
    title: 'Selecting analytical instruments for regulatory compliance',
    excerpt: 'A practical guide to equipment selection for pharma and environmental laboratories.',
    tags: ['Analytics', 'Compliance', 'Pharma'],
    date: '2026-02-25',
  },
]
