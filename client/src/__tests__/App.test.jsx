jest.mock('../api/axiosConfig.js', () => {
    const axiosMock = {};
    ['get','post','put','delete'].forEach((m) => {
        axiosMock[m] = jest.fn();
    });
    axiosMock.create = jest.fn(() => axiosMock);
    return { __esModule: true, default: axiosMock };
});

jest.mock('../assets/underconstructionlogo.png', () => 'underconstructionlogo.png');

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';

const mockReducer = (state = { auth: { user: { name: 'Test' } } }) => state;
const store = configureStore({ reducer: mockReducer });

test('renders main navigation and logo', () => {
    render(
        <Provider store={store}>
                <App />
        </Provider>
    );

    expect(screen.getByAltText(/under construction logo/i)).toBeInTheDocument();
});