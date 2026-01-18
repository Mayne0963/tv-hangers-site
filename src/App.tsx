import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Account from '@/pages/Account'
import Admin from '@/pages/Admin'
import Contact from '@/pages/Contact'
import Faq from '@/pages/Faq'
import Home from '@/pages/Home'
import OrderDetails from '@/pages/OrderDetails'
import Orders from '@/pages/Orders'
import Portfolio from '@/pages/Portfolio'
import PortfolioProject from '@/pages/PortfolioProject'
import Quote from '@/pages/Quote'
import Reviews from '@/pages/Reviews'
import Offline from '@/pages/Offline'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'

export default function App() {
  useAuthBootstrap()

  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<PortfolioProject />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  )
}
