export const CATEGORIES = [
  { id: 'all',          label: 'All Trends',   emoji: '⚡' },
  { id: 'Social Media', label: 'Social Media',  emoji: '📱' },
  { id: 'Fashion',      label: 'Fashion',       emoji: '👗' },
  { id: 'Tech',         label: 'Tech',          emoji: '💻' },
  { id: 'Food',         label: 'Food',          emoji: '🍜' },
  { id: 'Fitness',      label: 'Fitness',       emoji: '🏋️' },
  { id: 'Beauty',       label: 'Beauty',        emoji: '✨' },
  { id: 'Travel',       label: 'Travel',        emoji: '✈️' },
  { id: 'Gaming',       label: 'Gaming',        emoji: '🎮' },
  { id: 'Finance',      label: 'Finance',       emoji: '💸' },
];

export const CAT_COLORS = {
  'Social Media': { color: '#7c6de8', bg: 'rgba(124,109,232,0.1)', border: 'rgba(124,109,232,0.25)' },
  'Fashion':      { color: '#e87cae', bg: 'rgba(232,124,174,0.1)', border: 'rgba(232,124,174,0.25)' },
  'Tech':         { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',  border: 'rgba(14,165,233,0.25)'  },
  'Food':         { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)'  },
  'Fitness':      { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)'   },
  'Beauty':       { color: '#d946ef', bg: 'rgba(217,70,239,0.1)',  border: 'rgba(217,70,239,0.25)'  },
  'Travel':       { color: '#14b8a6', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)'  },
  'Gaming':       { color: '#84cc16', bg: 'rgba(132,204,22,0.1)',  border: 'rgba(132,204,22,0.25)'  },
  'Finance':      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)'  },
};

export const CAT_EMOJI = {
  'Social Media': '📱', 'Fashion': '👗', 'Tech': '💻', 'Food': '🍜',
  'Fitness': '🏋️', 'Beauty': '✨', 'Travel': '✈️', 'Gaming': '🎮', 'Finance': '💸',
};

export const TRENDS = [
  { id:1, title:'De-influencing Movement', category:'Social Media', heat:94, desc:'Creators are going viral by telling audiences NOT to buy things — a counter-culture wave redefining authenticity and trust in influencer marketing.', tags:['#deinfluencing','#authenticity','#consumerism','#viral'], added:'2024-05-01' },
  { id:2, title:'Pilates Everywhere', category:'Fitness', heat:92, desc:'Pilates content is dominating feeds globally — from reformer studios to bedroom mat routines. The "Pilates body" aesthetic is fueling a fitness identity shift.', tags:['#pilates','#reformer','#bodygoals','#movement'], added:'2024-04-28' },
  { id:3, title:'Quiet Luxury Aesthetic', category:'Fashion', heat:91, desc:'Understated, logo-free, and expensive-looking. The "old money" aesthetic is overtaking loud streetwear — think neutral palettes, clean silhouettes, cashmere.', tags:['#quietluxury','#oldmoney','#aesthetics','#fashion'], added:'2024-04-25' },
  { id:4, title:'AI Productivity Stacks', category:'Tech', heat:90, desc:'Creators showcasing their AI tool setups are generating millions of views. "My entire workflow with AI" content outperforms nearly every other tech format.', tags:['#AItools','#productivity','#workflow','#tech'], added:'2024-05-03' },
  { id:5, title:'Glass Skin Routine', category:'Beauty', heat:87, desc:'The K-Beauty glass skin trend continues to surge with audiences obsessed with translucent, dewy complexions. Multi-step routines with serums and slugging are everywhere.', tags:['#glassskin','#KBeauty','#skincare','#glowy'], added:'2024-04-20' },
  { id:6, title:'AI Art Aesthetics', category:'Tech', heat:88, desc:'AI-generated visual styles — from hyperreal portraits to surreal dreamscapes — are spawning aesthetic niches faster than any previous art movement.', tags:['#AIart','#MidJourney','#digital','#generative'], added:'2024-04-30' },
  { id:7, title:'Retro Streetwear Revival', category:'Fashion', heat:85, desc:"90s and Y2K sportswear is back — baggy silhouettes, logo tees, and vintage sneakers. Thrift flipping content and archive fashion hauls are driving massive engagement.", tags:['#Y2K','#vintagestyle','#streetwear','#thrift'], added:'2024-04-18' },
  { id:8, title:'75 Hard Challenge', category:'Fitness', heat:83, desc:'75 days of strict discipline — two workouts, gallon of water, no alcohol, a diet, and 10 pages of reading daily. Transformation journeys are getting millions of views.', tags:['#75Hard','#transformation','#discipline','#challenge'], added:'2024-04-15' },
  { id:9, title:'BookTok Influence', category:'Social Media', heat:78, desc:'BookTok is moving literary culture at a pace publishers have never seen. A single creator recommendation can sell out print runs — a massive opportunity for niche content.', tags:['#BookTok','#reading','#books','#literature'], added:'2024-04-10' },
  { id:10, title:'Cozy Games Renaissance', category:'Gaming', heat:79, desc:'Low-stakes, aesthetically soothing games like Stardew Valley and Animal Crossing are pulling mainstream audiences into wholesome content.', tags:['#cozygames','#gaming','#StardewValley','#aesthetic'], added:'2024-04-22' },
  { id:11, title:'Adaptogen Coffee Blends', category:'Food', heat:76, desc:"Mushroom coffee, ashwagandha lattes, and lion's mane cold brew are replacing oat milk flat whites. Functional beverage content is spiking.", tags:['#adaptogens','#mushroomcoffee','#wellness','#functionalfood'], added:'2024-05-02' },
  { id:12, title:'Slow Travel Movement', category:'Travel', heat:72, desc:'Staying in one place for weeks instead of rushing through 10 countries. Slow travel content — house sits, monthly rentals, local immersion — resonates deeply.', tags:['#slowtravel','#digitalnomad','#travel','#housesit'], added:'2024-04-12' },
  { id:13, title:'Digital Detox Retreats', category:'Travel', heat:71, desc:'Off-grid cabin stays, phone-free weekends, and technology wellness retreats are skyrocketing. The irony of documenting your detox is not lost on creators.', tags:['#digitaldetox','#offgrid','#wellness','#retreat'], added:'2024-04-08' },
  { id:14, title:'Skinimalism Beauty', category:'Beauty', heat:73, desc:'Fewer products, better skin. Skinimalism rejects the 12-step routine in favor of a curated 3-step approach — "your skin but better" content is surging.', tags:['#skinimalism','#minimalskincare','#cleangirl','#beauty'], added:'2024-04-05' },
  { id:15, title:'Micro-Investing for Gen Z', category:'Finance', heat:68, desc:'Finance creators are gaining massive followings by demystifying investing for 18-25 year olds — fractional shares, round-up apps, and $5 investment walkthroughs.', tags:['#investing','#GenZfinance','#money','#personalfinance'], added:'2024-04-01' },
  { id:16, title:'Raw Food Revival', category:'Food', heat:65, desc:'Raw carrots, raw liver, raw milk — the "ancestral eating" trend is polarizing and viral. Whatever your stance, the debate is driving enormous content engagement.', tags:['#rawfood','#ancestraldiet','#nutrition','#controversial'], added:'2024-03-28' },
];

export function heatColor(score) {
  if (score >= 80) return 'var(--heat-hot)';
  if (score >= 65) return 'var(--heat-rising)';
  if (score >= 45) return 'var(--heat-warm)';
  return 'var(--heat-emerging)';
}

export function heatLabel(score) {
  if (score >= 80) return '🔥 Hot';
  if (score >= 65) return '📈 Rising';
  if (score >= 45) return '🌱 Warm';
  return '💡 Emerging';
}
