export const buttonTheme = {
  baseStyle: {
    fontWeight: "500",
    letterSpacing: "0.004rem",
    lineHeight: "1.25rem",
    fontSize: "sm",
    borderWidth: "1px",
    borderColor: "transparent",
    _focusVisible: {
      borderColor: "content.onSurfaceInverted.default",
      borderWidth: "1px",
      boxShadow: "0px 0px 0px 4px #4343D1",
    },
  },
  sizes: {
    standard: {
      minWidth: "44px",
      px: "standard.lg",
      borderRadius: "standard.base",
      py: "standard.sm",
      minHeight: "44px",
      svg: {
        boxSize: "20px",
      },
    },
    condensed: {
      minWidth: "36px",
      px: "condensed.lg",
      borderRadius: "condensed.base",
      py: "condensed.sm",
      height: "36px",
      maxWidth: "100%",
      svg: {
        boxSize: "20px",
      },
    },
    withBadgeCondensed: {
      paddingLeft: "condensed.lg!important",
      paddingRight: "condensed.lg!important",
      borderRadius: "condensed.base",
      py: "condensed.sm",
      minHeight: "36px",
      maxWidth: "100%",
      svg: {
        boxSize: "20px",
      },
    },
    withBadgeStandard: {
      minWidth: "44px",
      paddingLeft: "condensed.lg!important",
      paddingRight: "40px!important",
      borderRadius: "condensed.base",
      py: "condensed.sm",
      minHeight: "44px",
      maxWidth: "100%",
      svg: {
        boxSize: "20px",
      },
    },
    navLink: {
      minWidth: "auto",
      px: "standard.sm",
      borderRadius: "standard.md",
      py: "standard.xs",
      minHeight: "36px",
      maxWidth: "100%",
      justifyContent: "flex-start",
      whiteSpace: "normal",
      overflowWrap: "break-word",
      wordWrap: "break-word",
      lineHeight: "normal",
      textAlign: "left",
      svg: {
        boxSize: "24px",
      },
    },
    learnNavLink: {
      minWidth: "auto",
      px: "standard.sm",
      borderRadius: "0",
      py: "standard.xs",
      minHeight: "36px",
      maxWidth: "100%",
      justifyContent: "flex-start",
      whiteSpace: "normal",
      overflowWrap: "break-word",
      wordWrap: "break-word",

      textAlign: "left",
      svg: {
        boxSize: "24px",
      },
    },
  },
  variants: {
    primary: {
      bg: "surface.accent.default",
      color: "content.onSurfaceInverted.default",
      svg: {
        fill: "content.onSurfaceInverted.default",
      },
      _hover: {
        bg: "surface.accent.hover",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.accent.selected",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    secondary: {
      position: "relative",
      borderWidth: "1px",
      borderColor: "border.forms",
      bg: "surface.forms.default",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      _hover: {
        bg: "#E8E6E8",
        opacity: 1,
        svg: {
          fill: "content.default.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.default",
        svg: {
          fill: "content.default.default",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    outline: {
      borderWidth: "1px",
      borderColor: "border.forms!important",
      bg: "surface.forms.default",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      _hover: {
        bg: "surface.forms.hover",
        svg: {
          fill: "content.default.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.default",
        svg: {
          fill: "content.default.default",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    ghost: {
      borderColor: "transparent",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      bg: "transparent",
      _hover: {
        bg: "surface.forms.hover",
        svg: {
          fill: "content.default.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.selected",
        color: "content.default.selected",
        svg: {
          fill: "content.default.selected",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    danger: {
      borderColor: "border.forms",
      bg: "surface.forms.default",
      color: "content.danger.default",
      svg: {
        fill: "content.danger.default",
      },
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      _hover: {
        bg: "surface.danger.default",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.danger.default",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        svg: {
          fill: "content.default.disabled",
        },

        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    navLink: {
      borderWidth: "1px",
      borderColor: "transparent",
      bg: "transparent",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0)",
      _hover: {
        bg: "surface.forms.hover",
        color: "content.default.hover",
        svg: {
          fill: "content.default.hover",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.selected",
        color: "content.default.selected",
        svg: {
          fill: "content.default.selected",
        },
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        svg: {
          fill: "content.default.disabled",
        },

        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    learnNavLink: {
      position: "relative",
      borderWidth: "0px",
      borderColor: "transparent",
      bg: "transparent",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0)",
      _before: {
        content: `""`,
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "4px",
        backgroundColor: "#1A1523",
        borderTopRightRadius: "4px",
        borderBottomRightRadius: "4px",
        opacity: 0,
      },
      _hover: {
        bg: "surface.forms.hover",
        color: "content.default.hover",
        svg: {
          fill: "content.default.hover",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.hover",

        _before: {
          opacity: 1, // Make the pseudo-element visible when active
        },
        color: "content.default.selected",
        svg: {
          fill: "content.default.selected",
        },
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        svg: {
          fill: "content.default.disabled",
        },

        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    feedback: {
      borderColor: "border.link",
      bg: "surface.forms.default",
      color: "content.links.default",
      svg: {
        fill: "content.links.default",
      },

      _hover: {
        //toDo no styles for feedback other than default
        opacity: 0.8,
        bg: "surface.forms.default",
        color: "content.links.default",
        svg: {
          fill: "content.links.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.default",
        color: "content.links.default",
        svg: {
          fill: "content.links.default",
        },
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        svg: {
          fill: "content.default.disabled",
        },

        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    special: {
      borderColor: "border.forms",
      minHeight: { base: "44px", xl: "72px" },
      px: { base: "standard.lg", xl: "standard.xl" },
      py: "standard.sm",
      bg: "surface.forms.default",
      color: "content.default.default",
      boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      svg: {
        width: "24px!important",
        height: "24px!important",
      },

      _hover: {
        color: "content.default.hover",
        backgroundColor: "surface.forms.hover",
      },
      _active: {
        bg: "surface.forms.selected",
        borderColor: "border.forms",
        color: "content.default.selected",
      },
      _disabled: {
        bg: "surface.forms.default",

        boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
        pointerEvents: "none",
        opacity: 1,
      },
      _focusVisible: {
        boxShadow: "0px 0px 0px 4px #3F8CFF, 0px 0px 0px 1px #F9F9FB",
      },
    },
    textSmall: {
      padding: 0,
      margin: 0,
      bg: "transparent",
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      fontWeight: "500",
      letterSpacing: "0.12px",
      minHeight: "10px",
      _hover: {
        opacity: 0.8,
      },
    },
  },
  defaultProps: { size: "standard", variant: "primary" },
};
