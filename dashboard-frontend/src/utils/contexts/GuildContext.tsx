import { createContext} from 'react'
import { PartialGuild } from '../types';

type GuildContextType = {
    guild?: PartialGuild;
    updateGuild: (guild: PartialGuild) => void;
};

export const GuildContext = createContext<GuildContextType>({
    updateGuild: () => {},
});

export const handleFocus = (input: any) => {
    input?.current?.focus()
  }
