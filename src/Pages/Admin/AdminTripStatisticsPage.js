import React from 'react'
import AdminSidebar from '../../My_Components/Admin/AdminSidebar'
import AdminTripStatistics from '../../My_Components/Admin/AdminTripStatisticsContent'

const AdminTripStatisticsPage = () => {
    return (
        <div>

            <AdminSidebar contentComponent={<AdminTripStatistics />} />
        </div>
    )
}

export default AdminTripStatisticsPage