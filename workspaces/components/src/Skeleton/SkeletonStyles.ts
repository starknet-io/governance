import { defineStyle, defineStyleConfig, cssVar } from '@chakra-ui/react'

const $startColor = cssVar('skeleton-start-color')
const $endColor = cssVar('skeleton-end-color')

const red = defineStyle({
  _light: {
    [$startColor.variable]: 'colors.red.100', //changing startColor to red.100
    [$endColor.variable]: 'colors.red.400', // changing endColor to red.400
    opacity:0.2
  },

})

const xl = defineStyle({
  h: 9,
  borderRadius: '4px',
})
export const skeletonTheme = defineStyleConfig({
  defaultProps: {
      size: 'xl',
    variant: 'red',
  },
  variants: { red },
   sizes: { xl },
})