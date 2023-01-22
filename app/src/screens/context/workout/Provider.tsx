import React from 'react';
import { useState } from "react"
import WorkoutContext from './Context';

const WorkoutProvider = ({ children }: any) => {
    const [reflection, setReflection] = useState('');
    return (
        <WorkoutContext.Provider value={{ reflection, setReflection }}>
            {children}
        </WorkoutContext.Provider>
    )
}

export default WorkoutProvider 