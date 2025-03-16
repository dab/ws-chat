import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowError = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        );
        
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders fallback UI when error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );
        
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error UI</div>}>
                <ThrowError />
            </ErrorBoundary>
        );
        
        expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    });
});
