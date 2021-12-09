import { createCss } from "@stitches/react";

const primaryColor = "#AF33FF";
const secondaryColor = "#EDADFF";
const textColor = "#787878";
const backgroundColor = "#201e1d";
const darkGrey = "#4f514e";
const lightGrey = "#8e918c";
const successColor = "#62CC35";
const errorColor = "#FF3F8C";
const warningColor = "#FFE60A";
const infoColor = "#2F96FC";

export const { styled, css, global, keyframes, getCssString, theme } =
  createCss({
    theme: {
      colors: {
        primary: `${primaryColor}`,
        secondary: `${secondaryColor}`,
        text: `${textColor}`,
        background: `${backgroundColor}`,
        darkGrey: `${darkGrey}`,
        lightGrey: `${lightGrey}`,
        success: `${successColor}`,
        error: `${errorColor}`,
        warning: `${warningColor}`,
        info: `${infoColor}`,
      },
    },
    media: {
      bp1: "(max-width: 960px)",
      bp2: "(max-width: 816px)",
    },
    utils: {
      marginX: (config) => (value) => ({
        marginLeft: value,
        marginRight: value,
      }),
    },
  });
