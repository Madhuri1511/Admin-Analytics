import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import '@testing-library/jest-dom';
import AnalyticsCard from './AnalyticsCard';

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('AnalyticsCard', () => {
  it('renders title and value', () => {
    renderWithStore(
      <AnalyticsCard title="Total Users" value="12,847" trend="+12%" />,
    );
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('12,847')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    const { getByTestId } = renderWithStore(
      <AnalyticsCard title="Revenue" value="$0" loading />,
    );
    expect(getByTestId('analytics-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('$0')).not.toBeInTheDocument();
  });
});
