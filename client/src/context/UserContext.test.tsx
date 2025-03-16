import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';

const TestComponent = () => {
    const { username, setUsername } = useUser();
    return (
        <div>
            <span data-testid="username">{username || 'no-user'}</span>
            <button onClick={() => setUsername('test-user')}>Login</button>
        </div>
    );
};

describe('UserContext', () => {
    it('provides initial state', () => {
        const { getByTestId } = render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );
        
        expect(getByTestId('username')).toHaveTextContent('no-user');
    });

    it('updates username', async () => {
        const { getByTestId, getByRole } = render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );
        
        await act(async () => {
            getByRole('button').click();
        });

        expect(getByTestId('username')).toHaveTextContent('test-user');
    });

    it('throws error when used outside provider', () => {
        const consoleError = console.error;
        console.error = vi.fn();
        
        expect(() => render(<TestComponent />)).toThrow();
        
        console.error = consoleError;
    });
});
