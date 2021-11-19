const colors = require('tailwindcss/colors')

module.exports = {
    mode: 'jit',
    purge: ['./src/Components/**/*.{js,jsx,ts,tsx}', './public/index.html', './src/components/*.{js,jsx}', './src/Components/**/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            gray: colors.coolGray,
            blue: colors.blue,
            red: colors.rose,
            pink: colors.fuchsia,
            indigo: colors.indigo,
            green: colors.emerald,
            // white: colors.white,

        },
        fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
        },
        
    },
    variants: {
        extend: {
            // borderColor: ['focus-visible'],
            opacity: ['disabled'],
        }
    }
}
