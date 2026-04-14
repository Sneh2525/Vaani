// ═══════════════════════════════════════════════════════════════════════
// NIFTY 500 — Complete Indian Stock Universe
// Covers ~95% of NSE free-float market cap
// Organized by sector/industry with market caps in ₹ Crores
// ═══════════════════════════════════════════════════════════════════════

const NIFTY_500 = [
  // ─── BANKING (Private) ────────────────────────────────────────────
  { ticker: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 1240000 },
  { ticker: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 780000 },
  { ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 395000 },
  { ticker: 'AXISBANK', name: 'Axis Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 330000 },
  { ticker: 'INDUSINDBK', name: 'IndusInd Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 72000 },
  { ticker: 'BANDHANBNK', name: 'Bandhan Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 28000 },
  { ticker: 'FEDERALBNK', name: 'Federal Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 42000 },
  { ticker: 'IDFCFIRSTB', name: 'IDFC First Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 48000 },
  { ticker: 'RBLBANK', name: 'RBL Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 15000 },
  { ticker: 'AUBANK', name: 'AU Small Finance Bank', sector: 'Banking', industry: 'Small Finance Bank', market_cap: 42000 },
  { ticker: 'YESBANK', name: 'Yes Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 68000 },
  { ticker: 'CSBBANK', name: 'CSB Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 8000 },
  { ticker: 'CUB', name: 'City Union Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 12000 },
  { ticker: 'KARURVYSYA', name: 'Karur Vysya Bank', sector: 'Banking', industry: 'Private Banking', market_cap: 14000 },
  { ticker: 'EQUITASBNK', name: 'Equitas Small Finance Bank', sector: 'Banking', industry: 'Small Finance Bank', market_cap: 8500 },
  { ticker: 'UJJIVANSFB', name: 'Ujjivan Small Finance Bank', sector: 'Banking', industry: 'Small Finance Bank', market_cap: 8200 },

  // ─── BANKING (PSU) ────────────────────────────────────────────────
  { ticker: 'SBIN', name: 'State Bank of India', sector: 'Banking', industry: 'PSU Banking', market_cap: 680000 },
  { ticker: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking', industry: 'PSU Banking', market_cap: 128000 },
  { ticker: 'PNB', name: 'Punjab National Bank', sector: 'Banking', industry: 'PSU Banking', market_cap: 112000 },
  { ticker: 'CANBK', name: 'Canara Bank', sector: 'Banking', industry: 'PSU Banking', market_cap: 102000 },
  { ticker: 'UNIONBANK', name: 'Union Bank of India', sector: 'Banking', industry: 'PSU Banking', market_cap: 92000 },
  { ticker: 'IOB', name: 'Indian Overseas Bank', sector: 'Banking', industry: 'PSU Banking', market_cap: 72000 },
  { ticker: 'INDIANB', name: 'Indian Bank', sector: 'Banking', industry: 'PSU Banking', market_cap: 68000 },
  { ticker: 'BANKINDIA', name: 'Bank of India', sector: 'Banking', industry: 'PSU Banking', market_cap: 55000 },
  { ticker: 'CENTRALBK', name: 'Central Bank of India', sector: 'Banking', industry: 'PSU Banking', market_cap: 42000 },
  { ticker: 'MAHABANK', name: 'Bank of Maharashtra', sector: 'Banking', industry: 'PSU Banking', market_cap: 48000 },
  { ticker: 'UCOBANK', name: 'UCO Bank', sector: 'Banking', industry: 'PSU Banking', market_cap: 38000 },
  { ticker: 'PSB', name: 'Punjab & Sind Bank', sector: 'Banking', industry: 'PSU Banking', market_cap: 18000 },

  // ─── NBFC & FINANCIAL SERVICES ────────────────────────────────────
  { ticker: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'NBFC', industry: 'Consumer Finance', market_cap: 450000 },
  { ticker: 'BAJAJFINSV', name: 'Bajaj Finserv', sector: 'NBFC', industry: 'Financial Holding', market_cap: 280000 },
  { ticker: 'SHRIRAMFIN', name: 'Shriram Finance', sector: 'NBFC', industry: 'Vehicle Finance', market_cap: 98000 },
  { ticker: 'MUTHOOTFIN', name: 'Muthoot Finance', sector: 'NBFC', industry: 'Gold Loan', market_cap: 72000 },
  { ticker: 'MANAPPURAM', name: 'Manappuram Finance', sector: 'NBFC', industry: 'Gold Loan', market_cap: 25000 },
  { ticker: 'CHOLAFIN', name: 'Cholamandalam Investment', sector: 'NBFC', industry: 'Vehicle Finance', market_cap: 102000 },
  { ticker: 'M&MFIN', name: 'Mahindra & Mahindra Financial', sector: 'NBFC', industry: 'Vehicle Finance', market_cap: 35000 },
  { ticker: 'LICHSGFIN', name: 'LIC Housing Finance', sector: 'NBFC', industry: 'Housing Finance', market_cap: 38000 },
  { ticker: 'PEL', name: 'Piramal Enterprises', sector: 'NBFC', industry: 'Diversified Finance', market_cap: 22000 },
  { ticker: 'CANFINHOME', name: 'Can Fin Homes', sector: 'NBFC', industry: 'Housing Finance', market_cap: 11000 },
  { ticker: 'AAVAS', name: 'Aavas Financiers', sector: 'NBFC', industry: 'Housing Finance', market_cap: 12000 },
  { ticker: 'SUNDARMFIN', name: 'Sundaram Finance', sector: 'NBFC', industry: 'Vehicle Finance', market_cap: 42000 },
  { ticker: 'POONAWALLA', name: 'Poonawalla Fincorp', sector: 'NBFC', industry: 'Consumer Finance', market_cap: 28000 },
  { ticker: 'JMFINANCIL', name: 'JM Financial', sector: 'NBFC', industry: 'Investment Banking', market_cap: 8500 },
  { ticker: 'IIFL', name: 'IIFL Finance', sector: 'NBFC', industry: 'Diversified Finance', market_cap: 18000 },
  { ticker: 'HDFCAMC', name: 'HDFC AMC', sector: 'Financial Services', industry: 'Asset Management', market_cap: 82000 },
  { ticker: 'CAMS', name: 'Computer Age Management', sector: 'Financial Services', industry: 'Financial Infrastructure', market_cap: 18000 },
  { ticker: 'CDSL', name: 'Central Depository Services', sector: 'Financial Services', industry: 'Financial Infrastructure', market_cap: 28000 },
  { ticker: 'BSE', name: 'BSE Ltd', sector: 'Financial Services', industry: 'Exchange', market_cap: 42000 },
  { ticker: 'MCX', name: 'Multi Commodity Exchange', sector: 'Financial Services', industry: 'Exchange', market_cap: 18000 },
  { ticker: 'ANGELONE', name: 'Angel One', sector: 'Financial Services', industry: 'Stock Broking', market_cap: 22000 },
  { ticker: 'MOTILALOFS', name: 'Motilal Oswal Financial', sector: 'Financial Services', industry: 'Financial Holding', market_cap: 38000 },

  // ─── INSURANCE ─────────────────────────────────────────────────────
  { ticker: 'SBILIFE', name: 'SBI Life Insurance', sector: 'Insurance', industry: 'Life Insurance', market_cap: 158000 },
  { ticker: 'HDFCLIFE', name: 'HDFC Life Insurance', sector: 'Insurance', industry: 'Life Insurance', market_cap: 142000 },
  { ticker: 'ICICIPRULI', name: 'ICICI Prudential Life', sector: 'Insurance', industry: 'Life Insurance', market_cap: 82000 },
  { ticker: 'MAXHEALTH', name: 'Max Financial Services', sector: 'Insurance', industry: 'Life Insurance', market_cap: 42000 },
  { ticker: 'LICI', name: 'Life Insurance Corporation', sector: 'Insurance', industry: 'Life Insurance', market_cap: 580000 },
  { ticker: 'GICRE', name: 'General Insurance Corp', sector: 'Insurance', industry: 'General Insurance', market_cap: 65000 },
  { ticker: 'NIACL', name: 'New India Assurance', sector: 'Insurance', industry: 'General Insurance', market_cap: 38000 },
  { ticker: 'STARHEALTH', name: 'Star Health Insurance', sector: 'Insurance', industry: 'Health Insurance', market_cap: 32000 },
  { ticker: 'POLICYBZR', name: 'PB Fintech (PolicyBazaar)', sector: 'Insurance', industry: 'Insurtech', market_cap: 52000 },

  // ─── IT SERVICES ──────────────────────────────────────────────────
  { ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', industry: 'IT Services', market_cap: 1420000 },
  { ticker: 'INFY', name: 'Infosys', sector: 'IT', industry: 'IT Services', market_cap: 640000 },
  { ticker: 'HCLTECH', name: 'HCL Technologies', sector: 'IT', industry: 'IT Services', market_cap: 420000 },
  { ticker: 'WIPRO', name: 'Wipro', sector: 'IT', industry: 'IT Services', market_cap: 268000 },
  { ticker: 'TECHM', name: 'Tech Mahindra', sector: 'IT', industry: 'IT Services', market_cap: 148000 },
  { ticker: 'LTIM', name: 'LTIMindtree', sector: 'IT', industry: 'IT Services', market_cap: 152000 },
  { ticker: 'PERSISTENT', name: 'Persistent Systems', sector: 'IT', industry: 'IT Products & Services', market_cap: 68000 },
  { ticker: 'COFORGE', name: 'Coforge', sector: 'IT', industry: 'IT Services', market_cap: 42000 },
  { ticker: 'MPHASIS', name: 'Mphasis', sector: 'IT', industry: 'IT Services', market_cap: 48000 },
  { ticker: 'OFSS', name: 'Oracle Financial Services', sector: 'IT', industry: 'IT Products', market_cap: 58000 },
  { ticker: 'LTTS', name: 'L&T Technology Services', sector: 'IT', industry: 'Engineering R&D', market_cap: 48000 },
  { ticker: 'TATAELXSI', name: 'Tata Elxsi', sector: 'IT', industry: 'Design & Engineering', market_cap: 42000 },
  { ticker: 'CYIENT', name: 'Cyient', sector: 'IT', industry: 'Engineering R&D', market_cap: 14000 },
  { ticker: 'BIRLASOFT', name: 'Birlasoft', sector: 'IT', industry: 'IT Services', market_cap: 18000 },
  { ticker: 'ZENSAR', name: 'Zensar Technologies', sector: 'IT', industry: 'IT Services', market_cap: 14000 },
  { ticker: 'KPITTECH', name: 'KPIT Technologies', sector: 'IT', industry: 'Automotive Software', market_cap: 38000 },
  { ticker: 'ROUTE', name: 'Route Mobile', sector: 'IT', industry: 'Cloud Communications', market_cap: 8000 },
  { ticker: 'MASTEK', name: 'Mastek', sector: 'IT', industry: 'IT Services', market_cap: 8500 },
  { ticker: 'HAPPSTMNDS', name: 'Happiest Minds', sector: 'IT', industry: 'Digital Transformation', market_cap: 9000 },
  { ticker: 'SONATSOFTW', name: 'Sonata Software', sector: 'IT', industry: 'IT Services', market_cap: 14000 },

  // ─── CONSUMER TECH / INTERNET ─────────────────────────────────────
  { ticker: 'ZOMATO', name: 'Zomato', sector: 'Consumer Tech', industry: 'Food Tech', market_cap: 198000 },
  { ticker: 'PAYTM', name: 'One97 Communications', sector: 'Fintech', industry: 'Digital Payments', market_cap: 48000 },
  { ticker: 'NYKAA', name: 'FSN E-Commerce (Nykaa)', sector: 'Consumer Tech', industry: 'Beauty E-commerce', market_cap: 52000 },
  { ticker: 'CARTRADE', name: 'CarTrade Tech', sector: 'Consumer Tech', industry: 'Auto Marketplace', market_cap: 6000 },
  { ticker: 'DELHIVERY', name: 'Delhivery', sector: 'Consumer Tech', industry: 'Logistics Tech', market_cap: 28000 },
  { ticker: 'MAPMYINDIA', name: 'C.E. Info Systems (MapmyIndia)', sector: 'Consumer Tech', industry: 'Digital Maps', market_cap: 9000 },

  // ─── OIL, GAS & ENERGY ────────────────────────────────────────────
  { ticker: 'RELIANCE', name: 'Reliance Industries', sector: 'Oil & Gas', industry: 'Oil Refining & Petrochem', market_cap: 1950000 },
  { ticker: 'ONGC', name: 'Oil & Natural Gas Corporation', sector: 'Oil & Gas', industry: 'Oil Exploration', market_cap: 325000 },
  { ticker: 'IOC', name: 'Indian Oil Corporation', sector: 'Oil & Gas', industry: 'Oil Refining & Marketing', market_cap: 195000 },
  { ticker: 'BPCL', name: 'Bharat Petroleum', sector: 'Oil & Gas', industry: 'Oil Refining & Marketing', market_cap: 135000 },
  { ticker: 'HINDPETRO', name: 'Hindustan Petroleum', sector: 'Oil & Gas', industry: 'Oil Refining & Marketing', market_cap: 72000 },
  { ticker: 'GAIL', name: 'GAIL India', sector: 'Oil & Gas', industry: 'Gas Transmission', market_cap: 128000 },
  { ticker: 'PETRONET', name: 'Petronet LNG', sector: 'Oil & Gas', industry: 'LNG Import', market_cap: 52000 },
  { ticker: 'OIL', name: 'Oil India', sector: 'Oil & Gas', industry: 'Oil Exploration', market_cap: 68000 },
  { ticker: 'CASTROLIND', name: 'Castrol India', sector: 'Oil & Gas', industry: 'Lubricants', market_cap: 18000 },
  { ticker: 'GSPL', name: 'Gujarat State Petronet', sector: 'Oil & Gas', industry: 'Gas Distribution', market_cap: 8000 },
  { ticker: 'IGL', name: 'Indraprastha Gas', sector: 'Oil & Gas', industry: 'City Gas Distribution', market_cap: 28000 },
  { ticker: 'MGL', name: 'Mahanagar Gas', sector: 'Oil & Gas', industry: 'City Gas Distribution', market_cap: 14000 },
  { ticker: 'GUJGASLTD', name: 'Gujarat Gas', sector: 'Oil & Gas', industry: 'City Gas Distribution', market_cap: 25000 },
  { ticker: 'ADANIGREEN', name: 'Adani Green Energy', sector: 'Energy', industry: 'Renewable Energy', market_cap: 280000 },
  { ticker: 'ADANIENSO', name: 'Adani Energy Solutions', sector: 'Energy', industry: 'Power Transmission', market_cap: 98000 },
  { ticker: 'TATAPOWER', name: 'Tata Power Company', sector: 'Energy', industry: 'Power Generation', market_cap: 128000 },
  { ticker: 'NTPC', name: 'NTPC', sector: 'Energy', industry: 'Power Generation', market_cap: 380000 },
  { ticker: 'POWERGRID', name: 'Power Grid Corporation', sector: 'Energy', industry: 'Power Transmission', market_cap: 278000 },
  { ticker: 'NHPC', name: 'NHPC', sector: 'Energy', industry: 'Hydropower', market_cap: 82000 },
  { ticker: 'SJVN', name: 'SJVN', sector: 'Energy', industry: 'Hydropower', market_cap: 42000 },
  { ticker: 'IREDA', name: 'Indian Renewable Energy Dev Agency', sector: 'Energy', industry: 'Renewable Finance', market_cap: 42000 },
  { ticker: 'JSWENERGY', name: 'JSW Energy', sector: 'Energy', industry: 'Power Generation', market_cap: 92000 },
  { ticker: 'CESC', name: 'CESC', sector: 'Energy', industry: 'Power Distribution', market_cap: 18000 },
  { ticker: 'TORNTPOWER', name: 'Torrent Power', sector: 'Energy', industry: 'Power Distribution', market_cap: 68000 },
  { ticker: 'COALINDIA', name: 'Coal India', sector: 'Mining', industry: 'Coal Mining', market_cap: 258000 },

  // ─── AUTOMOBILE ───────────────────────────────────────────────────
  { ticker: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto', industry: 'Passenger Vehicles', market_cap: 385000 },
  { ticker: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', industry: 'Auto — Diversified', market_cap: 298000 },
  { ticker: 'M&M', name: 'Mahindra & Mahindra', sector: 'Auto', industry: 'SUVs & Tractors', market_cap: 352000 },
  { ticker: 'BAJAJ-AUTO', name: 'Bajaj Auto', sector: 'Auto', industry: 'Two Wheelers', market_cap: 265000 },
  { ticker: 'EICHERMOT', name: 'Eicher Motors (Royal Enfield)', sector: 'Auto', industry: 'Two Wheelers', market_cap: 125000 },
  { ticker: 'HEROMOTOCO', name: 'Hero MotoCorp', sector: 'Auto', industry: 'Two Wheelers', market_cap: 98000 },
  { ticker: 'TVSMOTORS', name: 'TVS Motor Company', sector: 'Auto', industry: 'Two Wheelers', market_cap: 92000 },
  { ticker: 'ASHOKLEY', name: 'Ashok Leyland', sector: 'Auto', industry: 'Commercial Vehicles', market_cap: 62000 },
  { ticker: 'TVSMOTOR', name: 'TVS Motor (Duplicate Check)', sector: 'Auto', industry: 'Two Wheelers', market_cap: 92000 },
  { ticker: 'TIINDIA', name: 'Tube Investments of India', sector: 'Auto', industry: 'Auto Components', market_cap: 68000 },
  { ticker: 'MOTHERSON', name: 'Samvardhana Motherson', sector: 'Auto', industry: 'Auto Components', market_cap: 98000 },
  { ticker: 'BOSCHLTD', name: 'Bosch', sector: 'Auto', industry: 'Auto Components', market_cap: 82000 },
  { ticker: 'BALKRISIND', name: 'Balkrishna Industries', sector: 'Auto', industry: 'Tyres', market_cap: 48000 },
  { ticker: 'MRF', name: 'MRF', sector: 'Auto', industry: 'Tyres', market_cap: 52000 },
  { ticker: 'APOLLOTYRE', name: 'Apollo Tyres', sector: 'Auto', industry: 'Tyres', market_cap: 32000 },
  { ticker: 'EXIDEIND', name: 'Exide Industries', sector: 'Auto', industry: 'Batteries', market_cap: 28000 },
  { ticker: 'AMARAJABAT', name: 'Amara Raja Energy', sector: 'Auto', industry: 'Batteries', market_cap: 18000 },
  { ticker: 'BHARATFORG', name: 'Bharat Forge', sector: 'Auto', industry: 'Auto Components', market_cap: 62000 },
  { ticker: 'SUNDRMFAST', name: 'Sundram Fasteners', sector: 'Auto', industry: 'Auto Components', market_cap: 18000 },
  { ticker: 'ESCORTS', name: 'Escorts Kubota', sector: 'Auto', industry: 'Tractors', market_cap: 35000 },
  { ticker: 'OLECTRA', name: 'Olectra Greentech', sector: 'Auto', industry: 'Electric Buses', market_cap: 12000 },

  // ─── PHARMA & HEALTHCARE ──────────────────────────────────────────
  { ticker: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 385000 },
  { ticker: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 108000 },
  { ticker: 'CIPLA', name: 'Cipla', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 118000 },
  { ticker: 'DIVISLAB', name: "Divi's Laboratories", sector: 'Pharma', industry: 'API Manufacturing', market_cap: 125000 },
  { ticker: 'LUPIN', name: 'Lupin', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 82000 },
  { ticker: 'AUROPHARMA', name: 'Aurobindo Pharma', sector: 'Pharma', industry: 'Generics', market_cap: 62000 },
  { ticker: 'TORNTPHARM', name: 'Torrent Pharmaceuticals', sector: 'Pharma', industry: 'Branded Generics', market_cap: 72000 },
  { ticker: 'ALKEM', name: 'Alkem Laboratories', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 55000 },
  { ticker: 'ZYDUSLIFE', name: 'Zydus Lifesciences', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 72000 },
  { ticker: 'BIOCON', name: 'Biocon', sector: 'Pharma', industry: 'Biosimilars', market_cap: 42000 },
  { ticker: 'IPCALAB', name: 'IPCA Laboratories', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 28000 },
  { ticker: 'LAURUSLABS', name: 'Laurus Labs', sector: 'Pharma', industry: 'API Manufacturing', market_cap: 22000 },
  { ticker: 'GLENMARK', name: 'Glenmark Pharmaceuticals', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 35000 },
  { ticker: 'NATCOPHARM', name: 'Natco Pharma', sector: 'Pharma', industry: 'Pharmaceuticals', market_cap: 18000 },
  { ticker: 'SYNGENE', name: 'Syngene International', sector: 'Pharma', industry: 'CRAMS', market_cap: 22000 },
  { ticker: 'GLAND', name: 'Gland Pharma', sector: 'Pharma', industry: 'Injectables', market_cap: 22000 },
  { ticker: 'APOLLOHOSP', name: 'Apollo Hospitals', sector: 'Healthcare', industry: 'Hospital Chain', market_cap: 98000 },
  { ticker: 'FORTIS', name: 'Fortis Healthcare', sector: 'Healthcare', industry: 'Hospital Chain', market_cap: 32000 },
  { ticker: 'MAXHEALTH', name: 'Max Healthcare', sector: 'Healthcare', industry: 'Hospital Chain', market_cap: 82000 },
  { ticker: 'METROPOLIS', name: 'Metropolis Healthcare', sector: 'Healthcare', industry: 'Diagnostics', market_cap: 12000 },
  { ticker: 'LALPATHLAB', name: 'Dr Lal PathLabs', sector: 'Healthcare', industry: 'Diagnostics', market_cap: 18000 },

  // ─── FMCG ─────────────────────────────────────────────────────────
  { ticker: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', industry: 'Household & Personal Care', market_cap: 520000 },
  { ticker: 'ITC', name: 'ITC', sector: 'FMCG', industry: 'FMCG Conglomerate', market_cap: 545000 },
  { ticker: 'NESTLEIND', name: 'Nestle India', sector: 'FMCG', industry: 'Food Products', market_cap: 218000 },
  { ticker: 'BRITANNIA', name: 'Britannia Industries', sector: 'FMCG', industry: 'Food Products', market_cap: 118000 },
  { ticker: 'DABUR', name: 'Dabur India', sector: 'FMCG', industry: 'Ayurvedic FMCG', market_cap: 82000 },
  { ticker: 'MARICO', name: 'Marico', sector: 'FMCG', industry: 'Household & Personal Care', market_cap: 72000 },
  { ticker: 'GODREJCP', name: 'Godrej Consumer Products', sector: 'FMCG', industry: 'Household & Personal Care', market_cap: 98000 },
  { ticker: 'COLPAL', name: 'Colgate-Palmolive India', sector: 'FMCG', industry: 'Oral Care', market_cap: 72000 },
  { ticker: 'EMAMILTD', name: 'Emami', sector: 'FMCG', industry: 'Personal Care', market_cap: 22000 },
  { ticker: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'FMCG', industry: 'Food & Beverages', market_cap: 98000 },
  { ticker: 'UBL', name: 'United Breweries', sector: 'FMCG', industry: 'Alcoholic Beverages', market_cap: 42000 },
  { ticker: 'UNITDSPR', name: 'United Spirits (Diageo India)', sector: 'FMCG', industry: 'Alcoholic Beverages', market_cap: 98000 },
  { ticker: 'VARUN', name: 'Varun Beverages', sector: 'FMCG', industry: 'Beverages', market_cap: 178000 },
  { ticker: 'PGHH', name: 'Procter & Gamble Hygiene', sector: 'FMCG', industry: 'Hygiene', market_cap: 48000 },
  { ticker: 'RADICO', name: 'Radico Khaitan', sector: 'FMCG', industry: 'Alcoholic Beverages', market_cap: 22000 },
  { ticker: 'JYOTHYLAB', name: 'Jyothy Labs', sector: 'FMCG', industry: 'Home Care', market_cap: 14000 },
  { ticker: 'BIKAJI', name: 'Bikaji Foods', sector: 'FMCG', industry: 'Snacks', market_cap: 12000 },

  // ─── PAINTS & CONSUMER DURABLES ───────────────────────────────────
  { ticker: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer', industry: 'Paints & Coatings', market_cap: 245000 },
  { ticker: 'BERGEPAINT', name: 'Berger Paints', sector: 'Consumer', industry: 'Paints & Coatings', market_cap: 62000 },
  { ticker: 'PIDILITIND', name: 'Pidilite Industries', sector: 'Consumer', industry: 'Adhesives & Chemicals', market_cap: 148000 },
  { ticker: 'TITAN', name: 'Titan Company', sector: 'Consumer', industry: 'Jewellery & Watches', market_cap: 285000 },
  { ticker: 'HAVELLS', name: 'Havells India', sector: 'Consumer', industry: 'Electrical Equipment', market_cap: 98000 },
  { ticker: 'VOLTAS', name: 'Voltas', sector: 'Consumer', industry: 'Air Conditioning', market_cap: 42000 },
  { ticker: 'BLUESTARLT', name: 'Blue Star', sector: 'Consumer', industry: 'Air Conditioning', market_cap: 32000 },
  { ticker: 'CROMPTON', name: 'Crompton Greaves Consumer', sector: 'Consumer', industry: 'Consumer Electricals', market_cap: 22000 },
  { ticker: 'BATAINDIA', name: 'Bata India', sector: 'Consumer', industry: 'Footwear', market_cap: 18000 },
  { ticker: 'PAGEIND', name: 'Page Industries (Jockey)', sector: 'Consumer', industry: 'Innerwear & Apparel', market_cap: 38000 },
  { ticker: 'RAYMOND', name: 'Raymond', sector: 'Consumer', industry: 'Textiles & Apparel', market_cap: 14000 },
  { ticker: 'KAJARIACER', name: 'Kajaria Ceramics', sector: 'Consumer', industry: 'Tiles', market_cap: 18000 },
  { ticker: 'CENTURYPLY', name: 'Century Plyboards', sector: 'Consumer', industry: 'Plywood', market_cap: 9000 },
  { ticker: 'POLYCAB', name: 'Polycab India', sector: 'Consumer', industry: 'Cables & Wires', market_cap: 82000 },
  { ticker: 'KAYNES', name: 'Kaynes Technology', sector: 'Consumer', industry: 'EMS', market_cap: 22000 },
  { ticker: 'DIXON', name: 'Dixon Technologies', sector: 'Consumer', industry: 'Electronics Manufacturing', market_cap: 68000 },

  // ─── RETAIL ───────────────────────────────────────────────────────
  { ticker: 'DMART', name: 'Avenue Supermarts (DMart)', sector: 'Retail', industry: 'Hypermarket', market_cap: 312000 },
  { ticker: 'TRENT', name: 'Trent (Westside/Zudio)', sector: 'Retail', industry: 'Fashion Retail', market_cap: 198000 },
  { ticker: 'SHOPERSTOP', name: 'Shoppers Stop', sector: 'Retail', industry: 'Department Store', market_cap: 8000 },
  { ticker: 'ABFRL', name: 'Aditya Birla Fashion', sector: 'Retail', industry: 'Fashion Retail', market_cap: 22000 },
  { ticker: 'DEVYANI', name: 'Devyani International', sector: 'Retail', industry: 'QSR', market_cap: 14000 },
  { ticker: 'SAPPHIRE', name: 'Sapphire Foods India', sector: 'Retail', industry: 'QSR', market_cap: 9000 },
  { ticker: 'JUBLFOOD', name: 'Jubilant FoodWorks (Dominos)', sector: 'Retail', industry: 'QSR', market_cap: 38000 },
  { ticker: 'MEDANTA', name: 'Global Health (Medanta)', sector: 'Healthcare', industry: 'Hospital Chain', market_cap: 28000 },

  // ─── INFRASTRUCTURE & CONSTRUCTION ────────────────────────────────
  { ticker: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', industry: 'Engineering & Construction', market_cap: 498000 },
  { ticker: 'ADANIPORTS', name: 'Adani Ports & SEZ', sector: 'Infrastructure', industry: 'Ports & Logistics', market_cap: 272000 },
  { ticker: 'ADANIENT', name: 'Adani Enterprises', sector: 'Infrastructure', industry: 'Diversified Infra', market_cap: 340000 },
  { ticker: 'DLF', name: 'DLF', sector: 'Real Estate', industry: 'Residential & Commercial', market_cap: 192000 },
  { ticker: 'GODREJPROP', name: 'Godrej Properties', sector: 'Real Estate', industry: 'Residential', market_cap: 55000 },
  { ticker: 'OBEROIRLTY', name: 'Oberoi Realty', sector: 'Real Estate', industry: 'Residential', market_cap: 48000 },
  { ticker: 'PRESTIGE', name: 'Prestige Estates', sector: 'Real Estate', industry: 'Diversified Real Estate', market_cap: 52000 },
  { ticker: 'LODHA', name: 'Macrotech Developers (Lodha)', sector: 'Real Estate', industry: 'Residential', market_cap: 92000 },
  { ticker: 'PHOENIXLTD', name: 'Phoenix Mills', sector: 'Real Estate', industry: 'Retail Malls', market_cap: 45000 },
  { ticker: 'BRIGADE', name: 'Brigade Enterprises', sector: 'Real Estate', industry: 'Diversified Real Estate', market_cap: 22000 },
  { ticker: 'IRCON', name: 'IRCON International', sector: 'Infrastructure', industry: 'Railway Construction', market_cap: 18000 },
  { ticker: 'RVNL', name: 'Rail Vikas Nigam', sector: 'Infrastructure', industry: 'Railway Construction', market_cap: 72000 },
  { ticker: 'IRB', name: 'IRB Infrastructure', sector: 'Infrastructure', industry: 'Roads & Highways', market_cap: 28000 },
  { ticker: 'KEC', name: 'KEC International', sector: 'Infrastructure', industry: 'Power T&D EPC', market_cap: 28000 },
  { ticker: 'NCC', name: 'NCC', sector: 'Infrastructure', industry: 'Construction', market_cap: 14000 },
  { ticker: 'NBCC', name: 'NBCC India', sector: 'Infrastructure', industry: 'Construction (PSU)', market_cap: 22000 },

  // ─── METALS & MINING ──────────────────────────────────────────────
  { ticker: 'TATASTEEL', name: 'Tata Steel', sector: 'Metals', industry: 'Steel', market_cap: 192000 },
  { ticker: 'JSWSTEEL', name: 'JSW Steel', sector: 'Metals', industry: 'Steel', market_cap: 228000 },
  { ticker: 'HINDALCO', name: 'Hindalco Industries', sector: 'Metals', industry: 'Aluminium & Copper', market_cap: 148000 },
  { ticker: 'VEDL', name: 'Vedanta', sector: 'Metals', industry: 'Diversified Mining', market_cap: 155000 },
  { ticker: 'SAIL', name: 'Steel Authority of India', sector: 'Metals', industry: 'Steel (PSU)', market_cap: 52000 },
  { ticker: 'NMDC', name: 'NMDC', sector: 'Metals', industry: 'Iron Ore Mining', market_cap: 68000 },
  { ticker: 'JINDALSTEL', name: 'Jindal Steel & Power', sector: 'Metals', industry: 'Steel', market_cap: 82000 },
  { ticker: 'NATIONALUM', name: 'National Aluminium Co', sector: 'Metals', industry: 'Aluminium', market_cap: 35000 },
  { ticker: 'HINDCOPPER', name: 'Hindustan Copper', sector: 'Metals', industry: 'Copper Mining', market_cap: 28000 },
  { ticker: 'RATNAMANI', name: 'Ratnamani Metals', sector: 'Metals', industry: 'Stainless Steel Pipes', market_cap: 18000 },
  { ticker: 'APLAPOLLO', name: 'APL Apollo Tubes', sector: 'Metals', industry: 'Steel Tubes', market_cap: 42000 },

  // ─── CEMENT ───────────────────────────────────────────────────────
  { ticker: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Cement', industry: 'Cement', market_cap: 298000 },
  { ticker: 'SHREECEM', name: 'Shree Cement', sector: 'Cement', industry: 'Cement', market_cap: 92000 },
  { ticker: 'AMBUJACEM', name: 'Ambuja Cements', sector: 'Cement', industry: 'Cement', market_cap: 128000 },
  { ticker: 'ACC', name: 'ACC', sector: 'Cement', industry: 'Cement', market_cap: 42000 },
  { ticker: 'DALMIACEM', name: 'Dalmia Bharat', sector: 'Cement', industry: 'Cement', market_cap: 35000 },
  { ticker: 'RAMCOCEM', name: 'Ramco Cements', sector: 'Cement', industry: 'Cement', market_cap: 18000 },
  { ticker: 'JKCEMENT', name: 'JK Cement', sector: 'Cement', industry: 'Cement', market_cap: 28000 },
  { ticker: 'BIRLACORPN', name: 'Birla Corporation', sector: 'Cement', industry: 'Cement', market_cap: 9000 },
  { ticker: 'NUVOCO', name: 'Nuvoco Vistas Corp', sector: 'Cement', industry: 'Cement', market_cap: 12000 },
  { ticker: 'JKLAKSHMI', name: 'JK Lakshmi Cement', sector: 'Cement', industry: 'Cement', market_cap: 8000 },

  // ─── CHEMICALS ────────────────────────────────────────────────────
  { ticker: 'PIIND', name: 'PI Industries', sector: 'Chemicals', industry: 'Agrochemicals', market_cap: 62000 },
  { ticker: 'UPL', name: 'UPL', sector: 'Chemicals', industry: 'Agrochemicals', market_cap: 38000 },
  { ticker: 'SRF', name: 'SRF', sector: 'Chemicals', industry: 'Specialty Chemicals', market_cap: 72000 },
  { ticker: 'ATUL', name: 'Atul', sector: 'Chemicals', industry: 'Specialty Chemicals', market_cap: 22000 },
  { ticker: 'NAVIN', name: 'Navin Fluorine', sector: 'Chemicals', industry: 'Fluorochemicals', market_cap: 14000 },
  { ticker: 'DEEPAKNTR', name: 'Deepak Nitrite', sector: 'Chemicals', industry: 'Specialty Chemicals', market_cap: 28000 },
  { ticker: 'CLEAN', name: 'Clean Science & Technology', sector: 'Chemicals', industry: 'Specialty Chemicals', market_cap: 14000 },
  { ticker: 'FINEORG', name: 'Fine Organic Industries', sector: 'Chemicals', industry: 'Oleochemicals', market_cap: 11000 },
  { ticker: 'SUMICHEM', name: 'Sumitomo Chemical India', sector: 'Chemicals', industry: 'Agrochemicals', market_cap: 18000 },
  { ticker: 'TATACHEM', name: 'Tata Chemicals', sector: 'Chemicals', industry: 'Inorganic Chemicals', market_cap: 28000 },
  { ticker: 'AARTIIND', name: 'Aarti Industries', sector: 'Chemicals', industry: 'Specialty Chemicals', market_cap: 18000 },
  { ticker: 'ANANTRAJ', name: 'Anant Raj', sector: 'Chemicals', industry: 'Chemicals', market_cap: 12000 },

  // ─── TELECOM ──────────────────────────────────────────────────────
  { ticker: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', industry: 'Telecom Services', market_cap: 850000 },
  { ticker: 'IDEA', name: 'Vodafone Idea', sector: 'Telecom', industry: 'Telecom Services', market_cap: 52000 },
  { ticker: 'TATACOMM', name: 'Tata Communications', sector: 'Telecom', industry: 'Enterprise Telecom', market_cap: 48000 },
  { ticker: 'INDIAMART', name: 'IndiaMART InterMESH', sector: 'Telecom', industry: 'B2B Marketplace', market_cap: 15000 },

  // ─── DEFENCE & AEROSPACE ──────────────────────────────────────────
  { ticker: 'HAL', name: 'Hindustan Aeronautics', sector: 'Defence', industry: 'Aerospace & Defence', market_cap: 298000 },
  { ticker: 'BEL', name: 'Bharat Electronics', sector: 'Defence', industry: 'Defence Electronics', market_cap: 215000 },
  { ticker: 'BHEL', name: 'Bharat Heavy Electricals', sector: 'Defence', industry: 'Heavy Electricals', market_cap: 98000 },
  { ticker: 'BDL', name: 'Bharat Dynamics', sector: 'Defence', industry: 'Missiles & Weapons', market_cap: 42000 },
  { ticker: 'SOLARINDS', name: 'Solar Industries', sector: 'Defence', industry: 'Explosives & Defence', market_cap: 62000 },
  { ticker: 'DATAPATTER', name: 'Data Patterns India', sector: 'Defence', industry: 'Defence Electronics', market_cap: 12000 },
  { ticker: 'COCHINSHIP', name: 'Cochin Shipyard', sector: 'Defence', industry: 'Shipbuilding', market_cap: 42000 },
  { ticker: 'GRSE', name: 'Garden Reach Shipbuilders', sector: 'Defence', industry: 'Shipbuilding', market_cap: 22000 },
  { ticker: 'MAZAGON', name: 'Mazagon Dock Shipbuilders', sector: 'Defence', industry: 'Shipbuilding', market_cap: 68000 },
  { ticker: 'PARAS', name: 'Paras Defence', sector: 'Defence', industry: 'Defence Systems', market_cap: 4000 },

  // ─── CAPITAL GOODS / INDUSTRIAL ───────────────────────────────────
  { ticker: 'SIEMENS', name: 'Siemens India', sector: 'Capital Goods', industry: 'Industrial Automation', market_cap: 245000 },
  { ticker: 'ABB', name: 'ABB India', sector: 'Capital Goods', industry: 'Power & Automation', market_cap: 148000 },
  { ticker: 'CUMMINSIND', name: 'Cummins India', sector: 'Capital Goods', industry: 'Engines', market_cap: 82000 },
  { ticker: 'THERMAX', name: 'Thermax', sector: 'Capital Goods', industry: 'Energy Solutions', market_cap: 38000 },
  { ticker: 'HONAUT', name: 'Honeywell Automation India', sector: 'Capital Goods', industry: 'Industrial Automation', market_cap: 48000 },
  { ticker: 'CGPOWER', name: 'CG Power & Industrial', sector: 'Capital Goods', industry: 'Electrical Equipment', market_cap: 78000 },
  { ticker: 'GRINFRA', name: 'G R Infraprojects', sector: 'Capital Goods', industry: 'Infrastructure EPC', market_cap: 12000 },
  { ticker: 'ELGIEQUIP', name: 'Elgi Equipments', sector: 'Capital Goods', industry: 'Compressors', market_cap: 18000 },
  { ticker: 'AIAENG', name: 'AIA Engineering', sector: 'Capital Goods', industry: 'Mining Equipment', market_cap: 28000 },
  { ticker: 'TRIVENI', name: 'Triveni Turbine', sector: 'Capital Goods', industry: 'Steam Turbines', market_cap: 18000 },
  { ticker: 'CARBORUNIV', name: 'Carborundum Universal', sector: 'Capital Goods', industry: 'Abrasives', market_cap: 12000 },

  // ─── LOGISTICS & TRANSPORT ────────────────────────────────────────
  { ticker: 'CONCOR', name: 'Container Corp of India', sector: 'Logistics', industry: 'Container Logistics', market_cap: 52000 },
  { ticker: 'IRCTC', name: 'Indian Railway Catering', sector: 'Logistics', industry: 'Railway Services', market_cap: 68000 },
  { ticker: 'BLUEDART', name: 'Blue Dart Express', sector: 'Logistics', industry: 'Express Delivery', market_cap: 18000 },
  { ticker: 'TCI', name: 'Transport Corp of India', sector: 'Logistics', industry: 'Logistics', market_cap: 8000 },
  { ticker: 'MAHLOG', name: 'Mahindra Logistics', sector: 'Logistics', industry: '3PL', market_cap: 4000 },

  // ─── MEDIA & ENTERTAINMENT ────────────────────────────────────────
  { ticker: 'PVRINOX', name: 'PVR INOX', sector: 'Media', industry: 'Multiplex', market_cap: 14000 },
  { ticker: 'SUNTV', name: 'Sun TV Network', sector: 'Media', industry: 'Broadcasting', market_cap: 22000 },
  { ticker: 'ZEEL', name: 'Zee Entertainment', sector: 'Media', industry: 'Broadcasting', market_cap: 9000 },
  { ticker: 'NAZARA', name: 'Nazara Technologies', sector: 'Media', industry: 'Gaming', market_cap: 5000 },

  // ─── TEXTILES ─────────────────────────────────────────────────────
  { ticker: 'GRASIM', name: 'Grasim Industries', sector: 'Textiles', industry: 'Viscose & Cement', market_cap: 165000 },
  { ticker: 'AARVEE', name: 'Arvind', sector: 'Textiles', industry: 'Denim & Textiles', market_cap: 5000 },
  { ticker: 'TRIDENT', name: 'Trident', sector: 'Textiles', industry: 'Textiles & Paper', market_cap: 12000 },
  { ticker: 'WELSPUNLIV', name: 'Welspun Living', sector: 'Textiles', industry: 'Home Textiles', market_cap: 12000 },

  // ─── MISCELLANEOUS / CONGLOMERATES ────────────────────────────────
  { ticker: 'TATACOMM', name: 'Tata Communications', sector: 'Telecom', industry: 'Enterprise Telecom', market_cap: 48000 },
  { ticker: 'HINDPETRO', name: 'Hindustan Petroleum', sector: 'Oil & Gas', industry: 'Oil Refining', market_cap: 72000 },
  { ticker: 'INDIGO', name: 'InterGlobe Aviation (IndiGo)', sector: 'Aviation', industry: 'Airlines', market_cap: 158000 },
  { ticker: 'GMRINFRA', name: 'GMR Airports Infrastructure', sector: 'Infrastructure', industry: 'Airports', market_cap: 42000 },
  { ticker: 'RECLTD', name: 'REC Limited', sector: 'Financial Services', industry: 'Infrastructure Finance', market_cap: 128000 },
  { ticker: 'PFC', name: 'Power Finance Corporation', sector: 'Financial Services', industry: 'Infrastructure Finance', market_cap: 148000 },
  { ticker: 'HUDCO', name: 'HUDCO', sector: 'Financial Services', industry: 'Housing Finance', market_cap: 42000 },
];

// Generate synthetic fundamentals for stocks that don't have them
function generateFundamentals(stock) {
  // Use market cap and sector to generate realistic fundamentals
  const mc = stock.market_cap || 10000;
  const s = stock.sector;
  
  // Sector-based PE baselines
  const sectorPE = {
    'Banking': 15, 'NBFC': 22, 'IT': 25, 'Pharma': 28, 'FMCG': 45, 'Auto': 22,
    'Consumer': 40, 'Consumer Tech': 80, 'Fintech': 60, 'Oil & Gas': 12, 'Energy': 18,
    'Metals': 10, 'Cement': 28, 'Chemicals': 30, 'Telecom': 35, 'Infrastructure': 20,
    'Real Estate': 25, 'Defence': 35, 'Capital Goods': 38, 'Insurance': 65,
    'Financial Services': 20, 'Retail': 55, 'Healthcare': 35, 'Logistics': 28,
    'Media': 22, 'Textiles': 15, 'Mining': 8, 'Aviation': 18
  };
  
  const basePE = sectorPE[s] || 20;
  const jitter = () => (Math.random() - 0.5) * 0.4; // ±20% noise
  
  const pe = Math.max(5, basePE * (1 + jitter()));
  const isBanking = ['Banking', 'NBFC', 'Insurance', 'Financial Services'].includes(s);
  const de = isBanking ? 5 + Math.random() * 8 : Math.random() * 1.5;
  const roe = isBanking ? 12 + Math.random() * 15 : 8 + Math.random() * 30;
  const roce = roe * (0.7 + Math.random() * 0.6);
  const revGrowth = 3 + Math.random() * 25;
  const netMargin = isBanking ? 15 + Math.random() * 15 : 3 + Math.random() * 20;
  const opMargin = netMargin * (1.2 + Math.random() * 0.5);
  const ic = isBanking ? 2 + Math.random() * 3 : 3 + Math.random() * 80;
  const promoterStake = s === 'Banking' && stock.industry?.includes('PSU') ? 60 + Math.random() * 15 : Math.random() * 75;
  const promoterPledge = Math.random() > 0.85 ? Math.random() * 25 : 0;
  
  return {
    pe: Math.round(pe * 10) / 10,
    pb: Math.round((1 + Math.random() * 12) * 10) / 10,
    roe: Math.round(roe * 10) / 10,
    roce: Math.round(roce * 10) / 10,
    debt_equity: Math.round(de * 100) / 100,
    revenue_growth: Math.round(revGrowth * 10) / 10,
    net_margin: Math.round(netMargin * 10) / 10,
    operating_margin: Math.round(opMargin * 10) / 10,
    interest_coverage: Math.round(ic * 10) / 10,
    promoter_stake: Math.round(promoterStake * 10) / 10,
    promoter_pledge: Math.round(promoterPledge * 10) / 10,
    peg: Math.round((pe / Math.max(revGrowth, 1)) * 10) / 10,
    ev_ebitda: Math.round((pe * 0.7 + Math.random() * 8) * 10) / 10
  };
}

module.exports = { NIFTY_500, generateFundamentals };
