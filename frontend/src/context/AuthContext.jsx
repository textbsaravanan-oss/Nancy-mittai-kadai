import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const saved = localStorage.getItem('userInfo');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUserInfo(data);
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            throw new Error(message);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/api/users/register', { name, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUserInfo(data);
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    const authHeader = () => ({
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    });

    return (
        <AuthContext.Provider value={{
            userInfo, login, register, logout, error, loading, authHeader
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
