import React from 'react'
import { RadioCards, Flex, Text } from '@radix-ui/themes';
const LineThickness = ({ value, color, handleClick }: { value: number, color: string, handleClick: (state: number) => void; }) => {
    return (
        <RadioCards.Item value={value.toString()} onClick={e => handleClick(value)} className='w-100 p-3'>
            <Flex direction="column" className='gap-1 w-20'>
                <Flex direction="row" className='gap-1 justify-center' width="100%">
                    {/* <Text>Thickness: </Text> */}
                    <Text weight="bold">{value}</Text>
                    <Text>px </Text>
                </Flex>
                <div style={{ height: value + "px", backgroundColor: color }} className="w-100"></div>
            </Flex>

        </RadioCards.Item>
    )
}

export default LineThickness