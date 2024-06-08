import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import EmployeeList from './EmployeeList.jsx'
import EmployeeReport from './EmployeeReport.jsx'
export default function Contents() {
    const NotFound = () => <h1>Path Not Found</h1>
    return (
        <Routes>
            <Route path='/employees' element={<EmployeeList />} />
            <Route path='/report' element={<EmployeeReport />} />
            <Route path='/' element={<Navigate replace to='/employees' />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}