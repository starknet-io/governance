// WIP - Not in use yet
export interface Member {
  src: string;
  displayName: string;
  twitterHandle?: string;
  address: string;
  miniBio: string;
  readonly?: boolean;
}

export interface MembersListItemProps extends Member {
  index: number;
  totalMembers: number;
}

export interface MembersListProps {
  members: Member[];
}
