import Layout from '@/Layout'
import Home from '@pages/Home'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default AppRoutes
