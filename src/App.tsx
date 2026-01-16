import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';

import { Search } from './pages/Search';
import { Explore } from './pages/Explore';
import { DramaDetail } from './pages/DramaDetail';
import { Library } from './pages/Library';
import { AuthProvider } from './context/AuthContext';
import { AppConfigProvider } from './context/AppConfigContext';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Pricing } from './pages/Pricing';
import { Payment } from './pages/Payment';
import { AdminDashboard } from './pages/AdminDashboard';
import { MemberManagement } from './pages/MemberManagement';
import { SignUp } from './pages/SignUp';
import { PrivacyPolicy } from './pages/PrivacyPolicy';


// Create a client
const queryClient = new QueryClient();

function App() {


    return (
        <QueryClientProvider client={queryClient}>
            <AppConfigProvider>
                <AuthProvider>
                    <BrowserRouter>

                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route element={<MainLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/explore" element={<Explore />} />
                                <Route path="/library" element={<Library />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/payment" element={<Payment />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route path="/admin/settings" element={<AdminDashboard />} />
                                <Route path="/admin/members" element={<MemberManagement />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/drama/:id" element={<DramaDetail />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </AppConfigProvider>
        </QueryClientProvider>
    );
}

export default App;
