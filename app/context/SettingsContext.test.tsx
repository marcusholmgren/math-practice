import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsProvider, useSettings } from './SettingsContext';

// Mock component to use the context
const TestConsumerComponent = () => {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <div>
      <div data-testid="difficulty-display">{difficulty}</div>
      <button onClick={() => setDifficulty('easy')}>Set Easy</button>
      <button onClick={() => setDifficulty('hard')}>Set Hard</button>
    </div>
  );
};

describe('SettingsContext', () => {
  it('provides default difficulty and allows updating it', () => {
    render(
      <SettingsProvider>
        <TestConsumerComponent />
      </SettingsProvider>
    );

    // Check default difficulty
    expect(screen.getByTestId('difficulty-display')).toHaveTextContent('medium');

    // Update difficulty to 'easy'
    act(() => {
      screen.getByText('Set Easy').click();
    });
    expect(screen.getByTestId('difficulty-display')).toHaveTextContent('easy');

    // Update difficulty to 'hard'
    act(() => {
      screen.getByText('Set Hard').click();
    });
    expect(screen.getByTestId('difficulty-display')).toHaveTextContent('hard');
  });

  it('throws an error if useSettings is used outside of SettingsProvider', () => {
    // Suppress console.error for this test as React will log an error
    const originalError = console.error;
    console.error = vi.fn();

    let errorThrown = false;
    const ErrorBoundaryComponent = () => {
      try {
        useSettings();
      } catch (e) {
        if (e instanceof Error) {
          errorThrown = true;
        }
      }
      return null;
    };

    render(<ErrorBoundaryComponent />);
    expect(errorThrown).toBe(true);

    // Restore console.error
    console.error = originalError;
  });
});
