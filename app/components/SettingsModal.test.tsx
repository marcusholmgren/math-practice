import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsModal } from './SettingsModal';
import { SettingsProvider, useSettings } from '../context/SettingsContext'; // Context needed for the modal

// Mock props for the modal
const mockOnClose = vi.fn();

// Helper component to wrap Modal in Provider and allow inspecting context
const TestModalContainer = ({ initialDifficulty }: { initialDifficulty?: string }) => {
  // This inner component is needed because useSettings must be called by a child of SettingsProvider
  const ModalWithContextAccess = () => {
    const { difficulty } = useSettings();
    return (
      <>
        <SettingsModal isOpen={true} onClose={mockOnClose} />
        <div data-testid="current-difficulty-test">{difficulty}</div>
      </>
    );
  };

  // If an initial difficulty is provided for the test, we need a way to set it in the provider.
  // This is a bit complex for a simple test, so we'll rely on the default ('medium')
  // or test setting it through the modal itself.
  // For this test, we'll mostly interact with the modal and verify its state/props.
  // The SettingsProvider will provide its own default 'medium'.

  return (
    <SettingsProvider>
      <ModalWithContextAccess />
    </SettingsProvider>
  );
};


describe('SettingsModal', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockOnClose.mockClear();
    vi.restoreAllMocks();
  });

  it('renders correctly when open', () => {
    render(<TestModalContainer />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Select Difficulty:')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <SettingsProvider>
        <SettingsModal isOpen={false} onClose={mockOnClose} />
      </SettingsProvider>
    );
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button (times) is clicked', () => {
    render(<TestModalContainer />);
    fireEvent.click(screen.getByLabelText('Close settings modal'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the "Done" button is clicked', () => {
    render(<TestModalContainer />);
    fireEvent.click(screen.getByText('Done'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('updates difficulty in context when a difficulty button is clicked', () => {
    render(<TestModalContainer />);

    // Check initial (default from provider)
    expect(screen.getByTestId('current-difficulty-test')).toHaveTextContent('medium');
    // Medium button should be styled as active
    expect(screen.getByText('Medium')).toHaveClass('bg-blue-500');

    // Click 'Easy'
    act(() => {
      fireEvent.click(screen.getByText('Easy'));
    });
    // Check context update
    expect(screen.getByTestId('current-difficulty-test')).toHaveTextContent('easy');
    // Easy button should now be active
    expect(screen.getByText('Easy')).toHaveClass('bg-blue-500');
    expect(screen.getByText('Medium')).not.toHaveClass('bg-blue-500');


    // Click 'Hard'
    act(() => {
      fireEvent.click(screen.getByText('Hard'));
    });
    // Check context update
    expect(screen.getByTestId('current-difficulty-test')).toHaveTextContent('hard');
    // Hard button should now be active
    expect(screen.getByText('Hard')).toHaveClass('bg-blue-500');
    expect(screen.getByText('Easy')).not.toHaveClass('bg-blue-500');
  });

  it('highlights the currently selected difficulty button', () => {
    render( // Render with a fresh provider for this specific check if needed, but TestModalContainer is fine
      <SettingsProvider>
        {/* Start with a specific difficulty if we could easily pass it to provider,
            otherwise, we test the change from default 'medium' */}
        <SettingsModal isOpen={true} onClose={mockOnClose} />
      </SettingsProvider>
    );

    // Default is 'medium'
    expect(screen.getByText('Medium')).toHaveClass('bg-blue-500', 'text-white');
    expect(screen.getByText('Easy')).not.toHaveClass('bg-blue-500', 'text-white');

    // Change to 'Easy'
    act(() => {
      fireEvent.click(screen.getByText('Easy'));
    });
    expect(screen.getByText('Easy')).toHaveClass('bg-blue-500', 'text-white');
    expect(screen.getByText('Medium')).not.toHaveClass('bg-blue-500', 'text-white');
  });
});
