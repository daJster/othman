import { useContext } from 'react';
import {
    MeetingsContext,
    type MeetingsContextValue,
} from '@/providers/contexts';

export const useMeetingsContext = (): MeetingsContextValue => {
    const context = useContext(MeetingsContext);
    if (!context) {
        throw new Error(
            'useMeetingsContext must be used within a MeetingsProvider'
        );
    }
    return context;
};
