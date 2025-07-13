jest.mock('../utils/axiosConfig', () => {
    const axiosMock = {};
    ['get','post','put','delete'].forEach((m) => {
        axiosMock[m] = jest.fn();
    });
    axiosMock.create = jest.fn(() => axiosMock);
    return { __esModule: true, default: axiosMock };
});

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NavBar from '../components/NavBar';
import { MemoryRouter } from 'react-router-dom';

const mockReducer = (state = { auth: { user: { name: 'Test' } } }) => state;
const store = configureStore({ reducer: mockReducer });

test('shows Home and Profile links in NavBar', () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/work orders/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
});