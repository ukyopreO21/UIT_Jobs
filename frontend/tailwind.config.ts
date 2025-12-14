import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        screens: {
            bp1: "30rem", // 480px
            bp1x: "35rem", // 560px
            bp2: "40rem", // 640px
            bp2x: "45rem", // 720px
            bp3: "50rem", // 800px
            bp3x: "55rem", // 880px
            bp4: "60rem", // 960px
            bp4x: "65rem", // 1040px
            bp5: "70rem", // 1120px
            bp5x: "75rem", // 1200px
            bp6: "80rem", // 1280px
            bp6x: "85rem", // 1360px
            bp7: "90rem", // 1440px
            bp7x: "95rem", // 1520px
            bp8: "100rem", // 1600px
            bp8x: "105rem", // 1680px
            bp9: "110rem", // 1760px
            bp9x: "115rem", // 1840px
            bp10: "120rem", // 1920px
            bp11: "130rem", // 2080px
            bp12: "140rem", // 2240px
            bp13: "150rem", // 2400px
        },
        extend: {
            colors: {
                primary: {
                    border: "#e7e7e8",
                    bg: {
                        DEFAULT: "#f6f6f6",
                        50: "#f9fafa",
                        100: "#f1f1f2",
                    },
                    outline: "#e7e7e8",
                    text: "#535458",
                    backdrop: "#99a1af50",
                },
                secondary: {
                    blue: {
                        light: {
                            DEFAULT: colors.blue[100],
                            extra: colors.blue[200],
                        },
                        dark: {
                            DEFAULT: colors.blue[600],
                            extra: colors.blue[700],
                        },
                    },
                    green: {
                        light: {
                            DEFAULT: colors.green[100],
                            extra: colors.green[200],
                        },
                        dark: {
                            DEFAULT: colors.green[600],
                            extra: colors.green[700],
                        },
                    },
                    red: {
                        light: {
                            DEFAULT: colors.red[100],
                            extra: colors.red[200],
                        },
                        dark: {
                            DEFAULT: colors.red[600],
                            extra: colors.red[700],
                        },
                    },
                    yellow: {
                        light: {
                            DEFAULT: colors.yellow[100],
                            extra: colors.yellow[200],
                        },
                        dark: {
                            DEFAULT: colors.yellow[600],
                            extra: colors.yellow[700],
                        },
                    },
                },
            },
        },
    },
    plugins: [],
};
export default config;
