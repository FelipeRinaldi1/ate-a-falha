import { createTheme, type MantineColorsTuple } from '@mantine/core'

// N1: ED7D31 (Primary Accent)
const brandOrange: MantineColorsTuple = [
	'#fef3eb',
	'#fce3d2',
	'#f9c4a3',
	'#f5a271',
	'#f18646',
	'#ed7d31',
	'#df6418',
	'#c7500e',
	'#9e3f0b',
	'#7e3309'
]

// N2 (6C5F5B), N3 (4F4A45), N4 (F6F1EE) incorporated into dark scale
const darkThemeScale: MantineColorsTuple = [
	'#F6F1EE', // 0: Highest contrast light / text (N4)
	'#E5DFDB', // 1: Very light muted
	'#C2B8B3', // 2: Secondary text
	'#9E938E', // 3: Muted text / placeholder
	'#7E726D', // 4: Subtle borders
	'#6C5F5B', // 5: Secondary surfaces / borders (N2)
	'#4F4A45', // 6: Card / elevated backgrounds (N3)
	'#3B3733', // 7: Base dark container
	'#2A2724', // 8: Deep background
	'#1C1A18'  // 9: Deepest dark background
]

export const theme = createTheme({
	primaryColor: 'brand',
	primaryShade: { light: 5, dark: 5 },
	colors: {
		brand: brandOrange,
		dark: darkThemeScale
	},
	fontFamily: 'Outfit, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
	defaultRadius: 'md'
})
