import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AuthContext = createContext(null);

/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("user"));
    const [loggedin, setLoggedIn] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/user/me`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                });
                if (!response.ok) {
                  throw new Error(`Response status: ${response.status}`);
                }
            
                const data = await response.json();
                console.log(data);
                setUser(data.user);

              } catch (error) {
                console.error(error.message);
              }
            }
            if (localStorage.getItem("token")) {
                fetchData();
            }
    }, [loggedin]);

    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        localStorage.setItem("user", null);
        localStorage.setItem("token", null);
        setUser(null);
        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {
        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({ username: username, password: password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                return await response.json().then(json => json.message);
            }
        
            const data = await response.json();
            console.log(data);
            localStorage.setItem("token", data.token);
            setLoggedIn(true);
            navigate('/profile');
          } catch (error) {
            console.error(error.message);
          }
        return "weird";
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async (userData) => {
        try {
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                return await response.json().then(json => json.message);
            }
        
            const data = await response.json();
            console.log(data);
            navigate('/success');
          } catch (error) {
            console.error(error.message);
          }
        return "weird";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
