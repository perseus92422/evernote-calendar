import React from 'react'
import { CheckCircledIcon } from '@radix-ui/react-icons'
const ColorIcon = ({ value, selected, handleClick }: { value: string, selected: boolean, handleClick: (state: string) => void; }) => {

    return (
        <div className='cursor-pointer flex justify-center items-center rounded-full w-10 h-10' onClick={e => handleClick(value)} style={{ backgroundColor: value }}>
            {selected && <CheckCircledIcon color='white' width={24} height={24} />}
        </div>
    )
}

export default ColorIcon