type Version = {
	v: string;
	name: string;
	isMajor?: boolean;
}

const VERSION_2: Version = { v: '2', name: 'Version 2', isMajor: true, }
const VERSION_HISTORY: Version[] = [
	{ v: '2.8', name: 'Themes', isMajor: true, },
	{ v: '2.7', name: 'Sawayama', isMajor: true, },
	{ v: '2.6.1', name: 'Rules typo', },
	{ v: '2.6', name: 'Beeswax', isMajor: true, },
	{ v: '2.5.3', name: 'Code organization', },
	{ v: '2.5.2', name: 'Improved pile hitbox', },
	{ v: '2.5.1', name: 'Adjusted screen resolution cutoff', },
	{ v: '2.5', name: 'Gameplay tips', isMajor: true, },
	{ v: '2.4.3', name: 'Improve king movement in niche case', },
	{ v: '2.4.2', name: 'Unclickable Spider foundations', },
	{ v: '2.4.1', name: 'Safer auto-complete logic', },
	{ v: '2.4', name: 'Android improvements', isMajor: true, },
	{ v: '2.3.4', name: 'Whitehead rule adjustment', },
	{ v: '2.3.3', name: 'Merci explanation', },
	{ v: '2.3.2', name: 'Improved merci functionality', },
	{ v: '2.3.1', name: 'Edge case fix for removed stars', },
	{ v: '2.3', name: 'Canister', isMajor: true, },
	{ v: '2.2', name: 'Whitehead & Irmgard', isMajor: true, },
	{ v: '2.1', name: 'Spider fix', isMajor: true, },
]

export const VERSION = VERSION_HISTORY[0].v
export const LATEST_VERSION = VERSION_HISTORY.find(v => v.isMajor) ?? VERSION_2
