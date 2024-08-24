const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    require("daisyui"),
    plugin(function ({ addComponents }) {
      addComponents({
        ".icon-menu": {
          "@media (max-width: 992.98px)": {
            display: "block",
            position: "relative",
            width: "30px",
            height: "20px",
            cursor: "pointer",
            zIndex: "600",
            span: {
              transition: "all .3s ease 0s",
              top: "8px",
              left: "0",
              position: "absolute",
              width: "100%",
              height: "4px",
              borderRadius: "10px",
              backgroundColor: "#333333",
              "&:first-child": {
                top: "0",
              },
              "&:last-child": {
                top: "auto",
                bottom: "0",
              },
            },
            "&.active": {
              span: {
                transform: "scale(0)",
                "&:first-child": {
                  transform: "rotate(-45deg)",
                  top: "8px",
                },
                "&:last-child": {
                  transform: "rotate(45deg)",
                  bottom: "8px",
                },
              },
            },
          },
        },
      });
    }),
  ],
  //   darkTheme: "dark",
  //   darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  //   daisyui: {
  //     themes: [
  //       {
  //         light: {
  //           primary: "#93BBFB",
  //           "primary-content": "#212638",
  //           secondary: "#DAE8FF",
  //           "secondary-content": "#212638",
  //           accent: "#93BBFB",
  //           "accent-content": "#212638",
  //           neutral: "#212638",
  //           "neutral-content": "#ffffff",
  //           "base-100": "#ffffff",
  //           "base-200": "#f4f8ff",
  //           "base-300": "#DAE8FF",
  //           "base-content": "#212638",
  //           info: "#93BBFB",
  //           success: "#34EEB6",
  //           warning: "#FFCF72",
  //           error: "#FF8863",

  //           "--rounded-btn": "9999rem",

  //           ".tooltip": {
  //             "--tooltip-tail": "6px",
  //           },
  //           ".link": {
  //             textUnderlineOffset: "2px",
  //           },
  //           ".link:hover": {
  //             opacity: "80%",
  //           },
  //         },
  //       },
  //       {
  //         dark: {
  //           primary: "#212638",
  //           "primary-content": "#F9FBFF",
  //           secondary: "#323f61",
  //           "secondary-content": "#F9FBFF",
  //           accent: "#4969A6",
  //           "accent-content": "#F9FBFF",
  //           neutral: "#F9FBFF",
  //           "neutral-content": "#385183",
  //           "base-100": "#385183",
  //           "base-200": "#2A3655",
  //           "base-300": "#212638",
  //           "base-content": "#F9FBFF",
  //           info: "#385183",
  //           success: "#34EEB6",
  //           warning: "#FFCF72",
  //           error: "#FF8863",

  //           "--rounded-btn": "9999rem",

  //           ".tooltip": {
  //             "--tooltip-tail": "6px",
  //             "--tooltip-color": "oklch(var(--p))",
  //           },
  //           ".link": {
  //             textUnderlineOffset: "2px",
  //           },
  //           ".link:hover": {
  //             opacity: "80%",
  //           },
  //         },
  //       },
  //     ],
  //   },
  theme: {
    screens: {
      xl: { min: "1600px" },
      md1: { max: "1200px" },
      md2: { max: "992.98px" },
      md3: { max: "767.98px" },
      md4: { max: "500px" },
    },
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
        custom: "0 0 10px 2px rgba(34, 60, 80, 0.1)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
