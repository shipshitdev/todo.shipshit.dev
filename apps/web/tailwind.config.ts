import type { Config } from 'tailwindcss';

export default {
  presets: [require('@agenticindiedev/ui/tailwind.preset')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@agenticindiedev/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config;

