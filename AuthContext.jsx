import { createContext, useContext, useState } from 'react'; // ← 7dhef useEffect
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const navigate = useNavigate();

    const login = (data) => {
        const role = data.role || data.user?.role || '';
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ ...data, role }));
        setToken(data.token);
        setUser({ ...data, role });

        switch (role) {
            case 'SUPER_ADMIN':      navigate('/dashboard'); break;
            case 'FEDERATION_ADMIN': navigate('/dashboard'); break;
            case 'CLUB_ADMIN':       navigate('/dashboard'); break;
            case 'FAN':              navigate('/fan'); break;
            default:                 navigate('/');
        }
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);