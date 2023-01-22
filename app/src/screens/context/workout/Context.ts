import { createContext } from "react";

const WorkoutContext = createContext<{
    setReflection?: React.Dispatch<React.SetStateAction<string>>,
    reflection: string
}>({ reflection: '' })

export default WorkoutContext