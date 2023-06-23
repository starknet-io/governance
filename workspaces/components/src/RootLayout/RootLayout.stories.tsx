import { Meta } from '@storybook/react';
import * as Layout from './RootLayout';
import { ThemeProvider } from '../ThemeProvider';
import { NavGroup } from 'src/Navigation/NavGroup';
import { NavItem } from 'src/Navigation/NavItem';

import {
  HiCodeBracketSquare,
  HiOutlineLockClosed,
} from 'react-icons/hi2';

// import { PopoverIcon } from "../../components/Layout/Navbar/PopoverIcon";

export default {
  title: 'starknet.io/Layout.Root',
  component: Layout.Root,
} as Meta<typeof Layout.Root>;

export const Solid = () => (
  <ThemeProvider>
    <Layout.Root>
      <Layout.LeftAside>
        <NavItem icon={<HiCodeBracketSquare />} label="Proposals" />
        <NavItem icon={<HiOutlineLockClosed />} label="Delegates" />
        <NavGroup label="Councils">
          <NavItem icon={<HiCodeBracketSquare />} label="Builders" />
          <NavItem icon={<HiOutlineLockClosed />} label="Security" />
        </NavGroup>
      </Layout.LeftAside>
      <Layout.Main />
      {/* <Layout.RightAside /> */}
    </Layout.Root>
  </ThemeProvider>
);
