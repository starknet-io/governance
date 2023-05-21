import { DocumentProps } from 'src/renderer/types';

import {
  Box,
  AppBar,
  Button,
  SearchInput,
  DelegateCard,
  SimpleGrid,
} from '@yukilabs/governance-components';

const testData = [
  {
    address: 'vitalik.eth',
    avatar:
      'https://pbs.twimg.com/profile_images/1571999433046237185/j9ktCKhD_400x400.jpg', // Vitalik Buterin's Twitter profile image
    role: 'founder',
    statementExcerpt:
      'I am a co-founder of Ethereum and a full-time developer. I am interested in advancing blockchain technology and creating a decentralized world.',
    onClick: () => console.log('clicked Vitalik'),
    noOfVotes: '12.6m votes',
  },
  {
    address: 'satoshi.eth',
    avatar:
      'https://pbs.twimg.com/profile_images/1573727826523693063/HiGqLypz_400x400.jpg', // Satoshi Nakamoto (representative) Twitter profile image
    role: 'visionary',
    statementExcerpt:
      'Creator of Bitcoin. Passionate about a decentralized financial system and the potential of blockchain.',
    onClick: () => console.log('clicked Satoshi'),
    noOfVotes: '20.1m votes',
  },
  {
    address: 'aantonop.eth',
    avatar:
      'https://pbs.twimg.com/profile_images/570063561603289088/CfuQCX0Y_400x400.png', // Andreas M. Antonopoulos's Twitter profile image
    role: 'educator',
    statementExcerpt:
      'I am an information security expert, tech-entrepreneur, and author. I am also a well-known Bitcoin advocate and I am passionate about educating people about cryptocurrencies.',
    onClick: () => console.log('clicked Andreas'),
    noOfVotes: '8.5m votes',
  },
  {
    address: 'cz_binance.eth',
    avatar:
      'https://pbs.twimg.com/profile_images/1264301160345219073/YH1Dk-6M_400x400.jpg', // CZ Binance's Twitter profile image
    role: 'exchange CEO',
    statementExcerpt:
      'CEO of Binance. Committed to increasing the accessibility and transparency of the cryptocurrency market.',
    onClick: () => console.log('clicked CZ Binance'),
    noOfVotes: '9.2m votes',
  },
  {
    address: 'elonmusk.eth',
    avatar:
      'https://pbs.twimg.com/profile_images/1427448726707505153/4NVeU7i3_400x400.jpg', // Elon Musk's Twitter profile image
    role: 'technoking',
    statementExcerpt: 'Technoking of Tesla, Imperator of Mars🚀',
    onClick: () => console.log('clicked Elon Musk'),
    noOfVotes: '21.7m votes',
  },
];

export function Page() {
  return (
    <>
      <AppBar>
        <Box>
          <Box>
            <SearchInput />
          </Box>
        </Box>
        <Box display="flex" marginLeft="auto">
          <Button as="a" href="/delegates/create" variant="outline">
            Create delegate
          </Button>
        </Box>
      </AppBar>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(327px, 1fr))"
      >
        {testData.map((data) => (
          <DelegateCard key={data.address} {...data} />
        ))}
      </SimpleGrid>
    </>
  );
}

export const documentProps = {
  title: 'Delegates',
} satisfies DocumentProps;
