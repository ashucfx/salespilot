import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewLeadPage from './page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NewLeadPage UI Component', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders all required form fields', () => {
    render(<NewLeadPage />);
    
    // Check titles
    expect(screen.getByText('Create New Lead')).toBeInTheDocument();
    
    // Check required inputs
    expect(screen.getByPlaceholderText('John')).toBeRequired();
    expect(screen.getByPlaceholderText('Doe')).toBeRequired();
    expect(screen.getByPlaceholderText('john@company.com')).toBeRequired();
    expect(screen.getByPlaceholderText('Acme Corp')).toBeRequired();
  });

  it('handles form submission and navigates to /leads', async () => {
    render(<NewLeadPage />);
    
    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Tony' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Stark' } });
    fireEvent.change(screen.getByPlaceholderText('john@company.com'), { target: { value: 'tony@stark.com' } });
    fireEvent.change(screen.getByPlaceholderText('Acme Corp'), { target: { value: 'Stark Industries' } });

    // Submit form
    const saveButton = screen.getByText('Save Lead');
    fireEvent.click(saveButton);

    // Assert loading state
    expect(saveButton).toBeDisabled();

    // Fast-forward timeout
    jest.advanceTimersByTime(1000);

    // Assert navigation
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/leads');
    });
  });

  it('cancels and navigates back', () => {
    render(<NewLeadPage />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockBack).toHaveBeenCalled();
  });
});
