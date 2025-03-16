import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextValue {
    username: string | null;
    setUsername: (name: string) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{
            username,
            setUsername,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};
