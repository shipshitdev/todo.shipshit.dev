import type { Config } from 'tailwindcss';

export default {
  presets: [require('@shipshitdev/ui/tailwind.preset')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@shipshitdev/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config;

