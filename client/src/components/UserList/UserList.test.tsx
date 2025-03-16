import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserList } from './UserList';

describe('UserList', () => {
    const mockUsers = ['user1', 'user2', 'user3'];
    const currentUser = 'user2';

    it('renders all users', () => {
        render(<UserList userList={mockUsers} user={currentUser} />);
        
        mockUsers.forEach(user => {
            expect(screen.getByText(user)).toBeInTheDocument();
        });
    });

    it('highlights current user', () => {
        render(<UserList userList={mockUsers} user={currentUser} />);
        
        const currentUserElement = screen.getByText(currentUser);
        expect(currentUserElement.className).toContain('self');
    });

    it('displays correct number of users', () => {
        render(<UserList userList={mockUsers} user={currentUser} />);
        
        expect(screen.getByText(`Online Users (${mockUsers.length})`)).toBeInTheDocument();
    });

    it('handles empty user list', () => {
        render(<UserList userList={[]} user={currentUser} />);
        
        expect(screen.getByText('Online Users (0)')).toBeInTheDocument();
    });
});
