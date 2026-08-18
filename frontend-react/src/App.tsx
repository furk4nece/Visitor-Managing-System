import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AppLayout } from './components/Layout/AppLayout'
import { LoginPage } from './pages/Login/LoginPage'
import { VisitorsPage } from './pages/Visitors/VisitorsPage'
import { PersonalPage } from './pages/Personal/PersonalPage'
import { UsersPage } from './pages/Users/UsersPage'
import { ReportsPage } from './pages/Reports/ReportsPage'
import { ProfilePage } from './pages/Profile/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/visitors" replace />} />
            <Route path="/visitors" element={<VisitorsPage />} />
            <Route path="/personal" element={<PersonalPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/visitors" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
