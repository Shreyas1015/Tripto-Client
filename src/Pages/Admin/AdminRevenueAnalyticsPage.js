import { Sidebar } from 'lucide-react'
import React from 'react'
import AdminRevenueAnalytics from '../../My_Components/Admin/AdminRevenueAnalyticsContent'
import AdminSidebar from '../../My_Components/Admin/AdminSidebar'

const AdminRevenueAnalyticsPage = () => {
    return (
        <div>
            <AdminSidebar contentComponent={<AdminRevenueAnalytics />} />
        </div>
    )
}

export default AdminRevenueAnalyticsPage